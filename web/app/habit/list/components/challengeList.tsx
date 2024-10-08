'use client';

import { useMemo } from 'react';
import { useAllChallenges } from '@/providers/ChallengesProvider';
import { ChallengeBox } from '../../components/ChallengeBox';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import Loading from '../../components/Loading';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { logEventSimple } from '@/utils/gtag';

export default function ChallengeList() {
  const { address, isInitializing } = usePasskeyAccount();

  const { challenges: allChallenges, loading: loadingChallenges } = useAllChallenges();

  const challenges = useMemo(
    () => allChallenges.filter((c) => c?.public || c?.creator === address),
    [allChallenges, address],
  );

  const { data: joined, loading: loadingUserData } = useUserChallenges();

  const { push } = useRouter();

  const subTitle = useMemo(() => {
    if (address) return 'Join a Challenge Now!';
    return 'Browse Challenges';
  }, [address]);

  return (
    <main className="container flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center pb-24">
        <SubTitle text={subTitle} />

        <div className="pt-8" />
        {/* Challenge List */}
        {isInitializing || loadingUserData || loadingChallenges ? (
          <Loading />
        ) : (
          challenges.map((challenge) => {
            const isJoined = joined?.find((j) => j.id === challenge.id);
            const notEnded = challenge.endTimestamp > moment().unix();
            if (!isJoined && notEnded)
              return (
                <button
                  type="button"
                  className="m-2 w-full no-underline transition-transform duration-300 focus:scale-105"
                  key={challenge.id.toString()}
                  onClick={() => {
                    push(`/habit/stake/${challenge.id}`);
                    logEventSimple({
                      eventName: 'click_challenge_not_joined_ongoing',
                      category: 'browse',
                    });
                  }}
                >
                  <ChallengeBox challenge={challenge} fullWidth />
                </button>
              );
          })
        )}
      </div>
    </main>
  );
}
