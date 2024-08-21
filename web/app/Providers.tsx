'use client';

import './global.css';

import OnchainProviders from '@/OnchainProviders';
import { AllChallengesProvider } from '@/providers/ChallengesProvider';
import { NextUIProvider } from '@nextui-org/system';

/** Root layout to define the structure of every page
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnchainProviders>
      <NextUIProvider>
        <AllChallengesProvider>{children}</AllChallengesProvider>
      </NextUIProvider>
    </OnchainProviders>
  );
}
