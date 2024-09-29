/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import { ChallengePreview } from './ChallengeBox';
import { useRouter } from 'next/navigation';
import NewUser from './NewUser';
import { logEventSimple } from '@/utils/gtag';
import { Button } from '@nextui-org/button';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
  totalChallengeCount: number;
};

export default function Dashboard({ onGoingChallenges, totalChallengeCount }: DashboardProps) {
  const { push } = useRouter();

  return totalChallengeCount === 0 ? (
    <NewUser />
  ) : (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      {/* if no challenges, show new user component */}
      <div className="flex w-full items-center justify-center">
        <p className="my-4 font-londrina text-xl font-bold"> My Challenges </p>
      </div>

      {onGoingChallenges.length == 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="m-4 font-nunito text-base">No on going challenges, try joining one!</p>
          <Button
            color="primary"
            className="mt-4 w-1/2 no-underline"
            onClick={() => push('/habit/list')}
          >
            <div className="my-4 rounded-lg p-4">Explore</div>
          </Button>
        </div>
      )}

      {/* map challenges to list of buttons */}
      {onGoingChallenges.map((challenge, idx) => (
        <button
          type="button"
          key={`link-${idx}`}
          onClick={() => {
            push(`/habit/checkin/${challenge.id}`);
            logEventSimple({ eventName: 'click_challenge_joined_ongoing', category: 'browse' });
          }}
          className="w-full transition-transform duration-100 focus:scale-105"
        >
          <ChallengePreview
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
      ))}

      <button
        onClick={() => {
          push('/habit/history');
          logEventSimple({ eventName: 'click_challenge_history', category: 'browse' });
        }}
        className="my-6 py-4 text-dark"
      >
        <p className="font underline"> Challenge History </p>
      </button>
    </div>
  );
}
