import { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Challenge } from '@/types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { Button } from '@nextui-org/button';
import { BsTwitterX } from 'react-icons/bs';

import farcasterLogo from '@/imgs/socials/farcaster.png';
import Image from 'next/image';
import useSocialShare from '@/hooks/useSocialShare';
import { formatActivityTime } from '@/utils/timestamp';
import { challengeToEmoji } from '@/utils/challenges';
import { ChallengeTypes } from '@/constants';

type CheckinPopupProps = {
  challenge: Challenge;
  onClose: () => void;
  onCheckInPageClick: () => void;
  checkedIn: number;
  lastCheckedInActivity: {
    id: number;
    type: string;
    name: string;
    moving_time: number;
    distance?: number;
    polyline?: string;
  } | null;
};

function CheckinPopup({
  challenge,
  onClose,
  onCheckInPageClick,
  checkedIn,
  lastCheckedInActivity,
}: CheckinPopupProps) {
  const isFinished = useMemo(
    () => checkedIn >= challenge.minimumCheckIns,
    [checkedIn, challenge.minimumCheckIns],
  );

  const title = useMemo(() => {
    if (isFinished) return 'Challenge Completed!';
    return "You've Successfully\nChecked in!";
  }, [isFinished]);

  const shareContent = useMemo(() => {
    let content = isFinished
      ? `I've completed the challenge ${challenge.name}!`
      : `I just checked in for the challenge ${challenge.name}!`;

    if (lastCheckedInActivity && !lastCheckedInActivity.polyline) {
      content += `\n\n${challengeToEmoji(lastCheckedInActivity.type as ChallengeTypes)} ${
        lastCheckedInActivity.name
      }`;
      content += `\n⏱️ ${formatActivityTime(lastCheckedInActivity.moving_time)}`;
      if (lastCheckedInActivity.distance) {
        content += `\n📏 ${(lastCheckedInActivity.distance / 1000).toFixed(2)} km`;
      }
    }

    return content;
  }, [isFinished, challenge.name, lastCheckedInActivity]);

  const shareURL = window.origin + `/habit/stake/${challenge.id}`;

  // Create a frame URL for Farcaster
  const farcasterFrameURL = useMemo(() => {
    if (!lastCheckedInActivity) return '';

    const frameURL = new URL(`${window.origin}/api/frame/activity`);
    frameURL.searchParams.set('type', lastCheckedInActivity.type);
    frameURL.searchParams.set('name', lastCheckedInActivity.name ?? '');
    frameURL.searchParams.set('moving_time', lastCheckedInActivity.moving_time.toString());
    if (lastCheckedInActivity.distance) {
      frameURL.searchParams.set('distance', lastCheckedInActivity.distance.toString());
    }
    if (lastCheckedInActivity.polyline) {
      frameURL.searchParams.set('polyline', lastCheckedInActivity.polyline);
    }
    frameURL.searchParams.set('ref_link', shareURL);
    return frameURL.toString();
  }, [lastCheckedInActivity, shareURL]);

  const { shareOnX, shareOnFarcaster } = useSocialShare();

  const content = (
    <div className="flex flex-col items-center text-left">
      <ul className="mb-4 list-disc pl-5">
        {!isFinished && (
          <li>
            Total Check in: {checkedIn} / {challenge.minimumCheckIns}
          </li>
        )}
        <li>
          {' '}
          Challenge {isFinished ? 'settles' : 'ends'}{' '}
          {moment.unix(challenge.endTimestamp).fromNow()}
        </li>
      </ul>

      {/* share */}
      <div className="mt-4 flex flex-col text-center">
        <p className="text-xs text-default-400"> Share your progress with friends! </p>
        <div className="flex gap-2 p-2">
          <Button
            className="w-full"
            onClick={() => shareOnX(shareContent, shareURL)}
            endContent={<BsTwitterX />}
          >
            Share on
          </Button>
          <Button
            className="w-full"
            onClick={() => shareOnFarcaster(shareContent, [encodeURI(farcasterFrameURL)])}
            endContent={<Image src={farcasterLogo} alt="warp" height={25} width={25} />}
          >
            Share on
          </Button>
        </div>
      </div>
    </div>
  );

  const buttons = useMemo(() => {
    const defaultButtons = [
      {
        id: 'backToChallengeList',
        label: 'Back to Challenge List',
        onClick: onCheckInPageClick,
        isPrimary: true,
      },
    ];
    if (!isFinished) {
      defaultButtons.push({
        id: 'checkInOtherRecords',
        label: 'Check in other Records',
        onClick: onClose,
        isPrimary: true,
      });
    }
    return defaultButtons;
  }, [onCheckInPageClick, onClose, isFinished]);

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

CheckinPopup.propTypes = {
  challenge: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default CheckinPopup;
