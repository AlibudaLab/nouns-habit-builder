'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import moment, { now } from 'moment';
import { formatUnits } from 'viem';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { ChallengeWithCheckIns, UserChallengeStatus } from '@/types';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';
import useFields from '@/hooks/useFields';
import useCheckInRun, { CheckInFields } from '@/hooks/transaction/useCheckInRun';
import useRunData from '@/hooks/useRunData';
import useActivityUsage from '@/hooks/useActivityUsage';
import { ActivityDropDown } from './activityDropdown';
import { ChallengePreview } from 'app/habit/components/ChallengeBox';
import CheckinPopup from './CheckinPopup';
import { Button } from '@nextui-org/button';
import InviteLink from 'app/habit/components/InviteLink';
import { ConnectButton } from '@/components/Connect/ConnectButton';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import Leaderboard from 'app/habit/components/Leaderboard';
import { logEventSimple } from '@/utils/gtag';

const initFields: CheckInFields = {
  challengeId: 0,
  signature: '0x',
  activityId: 0,
};

/**
 * TEMP: Workout & Running activity check-in
 * @param param0
 * @returns
 */
export default function RunCheckIn({ challenge }: { challenge: ChallengeWithCheckIns }) {
  const { push } = useRouter();
  const { address } = usePasskeyAccount();
  const [chosenActivityId, setChosenActivityId] = useState<number>(0);
  const { fields, setField, resetFields } = useFields<CheckInFields>(initFields);
  const { activityMap, addToActivityMap } = useActivityUsage(address);
  const [isSigning, setIsSigning] = useState(false);

  const { refetch: refetchAll } = useUserChallenges();

  const challengeStarted = useMemo(
    () => moment().unix() > challenge.startTimestamp,
    [challenge.startTimestamp],
  );

  const challengeEnded = useMemo(
    () => moment().unix() > challenge.endTimestamp,
    [challenge.endTimestamp],
  );

  const canCheckInNow = useMemo(
    () => challengeStarted && !challengeEnded,
    [challengeStarted, challengeEnded],
  );

  const [isCheckinPopupOpen, setIsCheckinPopupOpen] = useState(false);
  const [lastCheckedInActivity, setLastCheckedInActivity] = useState<{
    id: number;
    type: string;
    name: string;
    moving_time: number;
    distance?: number;
    polyline?: string;
  } | null>(null);

  const handleOpenCheckinPopup = useCallback(() => setIsCheckinPopupOpen(true), []);
  const handleCloseCheckinPopup = useCallback(() => setIsCheckinPopupOpen(false), []);
  const handleChallengeListClick = useCallback(() => {
    push('/');
  }, [push]);

  const {
    connected: verifierConnected,
    runData,
    workoutData,
    cyclingData,
    error: runDataError,
    loading: stravaLoading,
  } = useRunData(challenge);

  // sign when address and activityId are ready (chosen)
  useEffect(() => {
    if (!address || chosenActivityId === 0) return;

    const fetchURL =
      '/api/sign?' +
      new URLSearchParams({
        address: address as string,
        activityId: chosenActivityId.toString(),
        challengeId: challenge.id.toString(),
      }).toString();

    const fetchSignature = async (): Promise<{ signature: `0x${string}` }> => {
      const response = await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    };
    setIsSigning(true);

    fetchSignature()
      .then((res) => {
        setField({
          signature: res.signature,
          challengeId: challenge.id,
          activityId: chosenActivityId,
        });
      })
      .catch((error) => {
        console.error('Error fetching the signature:', error);
      })
      .finally(() => {
        setIsSigning(false);
      });
  }, [address, chosenActivityId, challenge.id, setField]);

  // only show this button if user is not connected to strava
  const onClickConnectStrava = useCallback(() => {
    logEventSimple({ eventName: 'click_connect_strava', category: 'challenge' });
    // path that user will be redirected to after connecting to strava
    const redirectUri = window.origin + '/connect-run/strava';

    // after verification on the connect-run/strava page, direct back to this page
    const authUrl = stravaUtils.getAuthURL(redirectUri, window.location.href);
    window.location = authUrl as any;
  }, []);

  const activitiesToUse =
    challenge.type === ChallengeTypes.Run
      ? runData
      : challenge.type === ChallengeTypes.Cycling
      ? cyclingData
      : workoutData;

  const { onSubmitTransaction: onCheckInTx, isLoading: isCheckInLoading } = useCheckInRun(
    fields,
    () => {
      if (fields.activityId) {
        addToActivityMap(fields.challengeId, fields.activityId.toString());
        // Find the checked-in activity
        const checkedInActivity = activitiesToUse.find(a => a.id === fields.activityId);
        if (checkedInActivity) {
          const baseActivity = {
            id: checkedInActivity.id,
            type: challenge.type,
            name: checkedInActivity.name,
            moving_time: checkedInActivity.moving_time
          };

          switch (challenge.type) {
            case ChallengeTypes.Run:
            case ChallengeTypes.Cycling:
              setLastCheckedInActivity({
                ...baseActivity,
                distance: (checkedInActivity as stravaUtils.StravaRunData).distance,
                polyline: (checkedInActivity as stravaUtils.StravaRunData).polyline
              });
              break;
            case ChallengeTypes.Workout:
              setLastCheckedInActivity(baseActivity);
              break;
            default:
              console.error('Unknown challenge type:', challenge.type);
              setLastCheckedInActivity(baseActivity);
          }
        }
      }
      resetFields();
      Promise.all([refetchAll()]).catch((error) => {
        console.error('Error refetching data:', error);
        // Optionally, handle the error more specifically here
      });
      handleOpenCheckinPopup();
    },
  );

  const onClickCheckIn = async () => {
    if (fields.activityId === 0) {
      toast.error('Please select an activity');
      return;
    }
    onCheckInTx();
  };

  return (
    <div className="flex h-screen w-full flex-col items-center px-4 text-center">
      {/* overview   */}
      <div className="my-4 w-full">
        <ChallengePreview challenge={challenge} fullWidth checkedIn={challenge.checkedIn} />
      </div>

      {/* goal description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-xl font-bold text-dark"> Description </div>
        <div className="text-sm text-primary"> {challenge.description} </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-xl font-bold text-dark"> Staked Amount </div>
        <div className="flex text-sm text-primary">
          {`${formatUnits(challenge.stake, 6)} USDC`}{' '}
        </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-xl font-bold text-dark"> Invite Others </div>
        <InviteLink accessCode={challenge.accessCode} challengeId={challenge.id} />
      </div>

      <div className="m-4 text-center font-londrina text-base">
        ⏰ Challenge {challenge.endTimestamp > now() / 1000 ? 'settles' : 'settled'}{' '}
        {moment.unix(challenge.endTimestamp).fromNow()}
      </div>

      {/* middle section: if timestamp is not valid, show warning message */}

      {/* no address detected: ask user to connect */}
      {!address && <ConnectButton className="w-3/4" />}

      {challenge.status === UserChallengeStatus.Ongoing && verifierConnected && canCheckInNow && (
        <div className="flex w-full justify-center px-2">
          <ActivityDropDown
            isDisabled={!address}
            fields={fields}
            onActivitySelect={setChosenActivityId}
            loading={stravaLoading}
            activities={activitiesToUse}
            usedActivities={activityMap[challenge.id]}
          />
        </div>
      )}

      {/* if user already finish, always allow going to the claim page */}
      {challenge.status === UserChallengeStatus.Claimable && (
        <Button
          type="button"
          color="primary"
          className="mt-12 min-h-12 w-3/4 max-w-56"
          onClick={() => push(`/habit/claim/${challenge.id}`)}
        >
          Finish 🎉
        </Button>
      )}

      {/* challenge is not finished yet */}
      {challenge.status !== UserChallengeStatus.NotJoined &&
        (!canCheckInNow ? (
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <Button
              className="mt-4 min-h-12 w-3/4 max-w-56"
              color="primary"
              variant="flat"
              onClick={handleChallengeListClick}
            >
              Back to List
            </Button>
            <div className="text-center text-xs text-default-400">
              {challengeStarted ? 'Challenge has Ended' : 'Challenge has not Started'}
            </div>
          </div>
        ) : verifierConnected && !runDataError ? (
          <Button
            type="button"
            color="primary"
            className="mt-4 min-h-12 w-3/4 max-w-56"
            onClick={onClickCheckIn}
            isDisabled={isCheckInLoading || isSigning || chosenActivityId === 0}
            isLoading={isCheckInLoading || isSigning}
          >
            Check In
          </Button>
        ) : (
          <Button
            type="button"
            color="primary"
            className="mt-4 min-h-12 w-3/4 max-w-56"
            onClick={onClickConnectStrava}
          >
            Connect with Strava
          </Button>
        ))}

      {challenge && address && (
        <Leaderboard userRankings={challenge.joinedUsers} address={address} challenge={challenge} />
      )}

      {isCheckinPopupOpen && (
        <CheckinPopup
          challenge={challenge}
          checkedIn={challenge.checkedIn}
          onClose={handleCloseCheckinPopup}
          onCheckInPageClick={handleChallengeListClick}
          lastCheckedInActivity={lastCheckedInActivity}
        />
      )}
    </div>
  );
}
