/* eslint-disable */
'use client';

import { Challenge } from '@/types';
import { challengeToEmoji } from '@/utils/challenges';
import Link from 'next/link';
import toast from 'react-hot-toast';

type DashboardProps = {
  onGoingChallenges: Challenge[];
};

export default function Dashboard({ onGoingChallenges }: DashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Only show challenges */}
      <div className="flex w-full items-center justify-center gap-6 text-center">
        {onGoingChallenges.length > 0 && <p className="text-lg"> My Ongoing Challenges </p>}
      </div>

      {/* map challenges to list of buttons */}
      {onGoingChallenges.map((challenge, idx) => (
        <Link key={`link-${idx}`} href={`/habit/checkin/${challenge.id}`}>
          <button
            key={challenge.id.toString()}
            type="button"
            className="mt-4 w-full rounded-lg px-6 py-3 outline outline-2"
            style={{ borderColor: '#EDB830', width: '350px', height: '60px' }}
          >
            <div className="flex w-full justify-between">
              <div className="mr-4 text-2xl">{challengeToEmoji(challenge.type)}</div>
              <div className="justify-left items-start hover:text-black">
                <div className="flex text-sm">{challenge.startTimestamp} </div>
                <div className="flex text-sm">{challenge.name} </div>
              </div>
              <div className="text-lg">
                {' '}
                {/* {challenge.checkedIn?.toString()}/ {challenge.targetNum}{' '} */}
              </div>
            </div>
          </button>
        </Link>
      ))}

      {/* Space Divier */}
      <div className="py-12"></div>

      <Link href="/habit/stake">
        <button
          type="button"
          className="mt-4 rounded-lg px-6 py-3	outline-dotted outline-2"
          style={{ width: '350px', height: '80px' }}
        >
          <p className="text-md font-bold"> Join a Challenge </p>
          <p className="text-sm"> Join on-going challenges </p>
        </button>
      </Link>

      <Link href={''} onClick={() => toast('Coming soon')}>
        <button
          type="button"
          className="mt-4 rounded-lg px-6 py-3 outline-dotted outline-2 "
          style={{ width: '350px', height: '80px' }}
        >
          <p className="text-md font-bold"> Create a New Challenge </p>
          <p className="text-sm"> Create a new challenge and share! </p>
        </button>
      </Link>
    </div>
  );
}
