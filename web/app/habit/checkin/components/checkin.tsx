'use client';

import { useParams } from 'next/navigation';
import { ChallengeTypes } from '@/constants';
import RunCheckIn from './checkinRun';
import NFCCheckIn from './nfc';
import useChallenge from '@/hooks/useChallenge';
import Loading from 'app/habit/components/Loading';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { useChallengeWithCheckIns } from '@/hooks/useChallengeWithCheckIns';

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenge, loading } = useChallengeWithCheckIns(Number(challengeId));

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <SubTitle text="Happy Builder; Habit Builder!" />

      {loading ? (
        <Loading />
      ) : challenge ? (
        <>
          {(challenge.type === ChallengeTypes.Run ||
            challenge.type === ChallengeTypes.Workout ||
            challenge.type === ChallengeTypes.Cycling) && <RunCheckIn challenge={challenge} />}
        </>
      ) : (
        <div className="text-center"> Challenge not found </div>
      )}
    </div>
  );
}
