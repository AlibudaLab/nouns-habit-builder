import { Challenge, ChallengeWithCheckIns } from '@/types';
import { challengeToEmoji } from '@/utils/challenges';
import { formatDuration, getChallengePeriodHint } from '@/utils/timestamp';
import moment from 'moment';
import { CircularProgress } from '@nextui-org/react';
import { UserChallengeStatus } from '@/types';
import { useMemo } from 'react';

function TimeHint({
  startTimestamp,
  endTimestamp,
  showHint = true,
}: {
  startTimestamp: number;
  endTimestamp: number;
  showHint?: boolean;
}) {
  const hint = getChallengePeriodHint(startTimestamp, endTimestamp);
  return (
    <p className="text-xs opacity-80">
      {formatDuration(startTimestamp, endTimestamp)}
      {showHint && <span className="pl-2 font-nunito text-xs opacity-80">{hint}</span>}
    </p>
  );
}

export function ChallengeBox({
  challenge,
  fullWidth,
}: {
  challenge: Challenge;
  fullWidth?: boolean;
}) {
  const isPast = challenge.endTimestamp < moment().unix();

  return (
    <div className={`wrapped ${isPast && 'opacity-50'} ${fullWidth ? 'w-full' : 'm-2'}`}>
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2 text-primary">
          <TimeHint
            startTimestamp={challenge.startTimestamp}
            endTimestamp={challenge.endTimestamp}
          />
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> {challenge.participants} joined </p>
        </div>
        <div className="ml-auto p-2 text-sm font-bold">{challenge.minimumCheckIns} times</div>
      </div>
    </div>
  );
}

export function ChallengeBoxFilled({
  challenge,
  checkedIn,
  fullWidth,
}: {
  challenge: Challenge;
  checkedIn?: number;
  fullWidth?: boolean;
}) {
  const isPast = challenge.endTimestamp < moment().unix();
  return (
    <div
      className={`wrapped-filled bg-primary p-2 ${isPast ? 'opacity-50' : ''} ${
        fullWidth ? 'w-full' : 'm-2'
      }`}
    >
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2">
          <TimeHint
            startTimestamp={challenge.startTimestamp}
            endTimestamp={challenge.endTimestamp}
          />
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> {challenge.participants} joined </p>
        </div>
        {
          // if checkedIn is defined, show the checkedIn number, otherwise show the target number
          checkedIn !== undefined ? (
            <div className="ml-auto min-w-[64px] p-2 text-lg ">
              {checkedIn} / {challenge.minimumCheckIns}
            </div>
          ) : (
            <div className="text-md ml-auto p-2">{challenge.minimumCheckIns} times</div>
          )
        }
      </div>
    </div>
  );
}

function FractionDisplay({ numerator, denominator }: { numerator: number; denominator: number }) {
  return (
    <div className="inline-flex flex-col items-center">
      <span className="text-xs">{numerator}</span>
      <div className="h-px w-full bg-white" />
      <span className="text-xs">{denominator}</span>
    </div>
  );
}

export function ChallengePreview({
  challenge,
  checkedIn,
  fullWidth,
  showHint,
}: {
  challenge: ChallengeWithCheckIns;
  checkedIn: number;
  fullWidth?: boolean;
  showHint?: boolean;
}) {
  const userChallengeStatus = challenge.status;

  let percentage = (checkedIn * 100) / challenge.minimumCheckIns;

  const claimable = userChallengeStatus === UserChallengeStatus.Claimable;

  const customCss = useMemo(() => {
    if (userChallengeStatus === UserChallengeStatus.Failed) {
      return 'bg-failed';
    } else if (
      userChallengeStatus === UserChallengeStatus.Completed ||
      userChallengeStatus === UserChallengeStatus.Claimable
    ) {
      return 'bg-primary opacity-50';
    } else if (userChallengeStatus === UserChallengeStatus.Claimed) {
      return 'bg-primary opacity-50';
    }

    return 'bg-primary';
  }, [userChallengeStatus]);

  return (
    <div
      className={`${customCss} wrapped-filled p-2 transition-transform duration-300 focus:scale-105 ${
        fullWidth ? 'w-full' : 'm-2'
      }`}
    >
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2">
          <TimeHint
            startTimestamp={challenge.startTimestamp}
            endTimestamp={challenge.endTimestamp}
            showHint={showHint}
          />
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-xs">
            {' '}
            {challenge.public ? 'Public' : 'Private'} | {userChallengeStatus}
          </p>
        </div>
        <div className="ml-auto min-w-[64px] p-2 text-lg ">
          <CircularProgress
            value={percentage}
            size="lg"
            classNames={{
              svg: 'w-14 h-14',
              indicator: 'stroke-white stroke-[1.5px]',
              track: 'stroke-white/20 stroke-[1.5px]',
              value: 'text-xs font-nunito text-white',
              label: 'text-xs font-nunito',
            }}
            showValueLabel
            valueLabel={
              claimable ? (
                <div> Claim </div>
              ) : (
                <div className="flex flex-col gap-0">
                  <FractionDisplay numerator={checkedIn} denominator={challenge.minimumCheckIns} />
                </div>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
