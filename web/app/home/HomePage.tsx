'use client';

import { useUserChallenges } from '@/providers/UserChallengesProvider';
import Onboard from '../habit/components/Onboard';
import Dashboard from '../habit/components/UserDashboard';
import Loading from 'app/habit/components/Loading';
import moment from 'moment';
import { UserChallengeStatus } from '@/types';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';

export default function DashboardPage() {
  const { address, isInitializing } = usePasskeyAccount();
  const { data: challenges, loading } = useUserChallenges();

  const allOngoing = challenges
    ? challenges.filter(
        (c) => c.endTimestamp > moment().unix() || c.status === UserChallengeStatus.Claimable,
      )
    : [];

  const totalChallengeCount = challenges?.length;

  return (
    <main className="container flex flex-col items-center">
      {isInitializing ? (
        <Loading />
      ) : address === undefined ? (
        <Onboard />
      ) : loading ? (
        <Loading />
      ) : (
        <Dashboard onGoingChallenges={allOngoing} totalChallengeCount={totalChallengeCount} />
      )}
    </main>
  );
}
