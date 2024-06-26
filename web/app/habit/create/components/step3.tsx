/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import React from 'react';
import { ChallengeTypes } from '@/constants';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { Snippet } from '@nextui-org/snippet';
import useSocialShare from '@/hooks/useSocialShare';
import { BsTwitterX } from 'react-icons/bs';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';

import farcasterLogo from '@/imgs/socials/farcaster.png';

type Step3Props = {
  accessCode: string;
  name?: string;
  stake?: number;
  challengeType: ChallengeTypes;
  challengeId: number;
};

export default function CreateStep3({ accessCode, challengeId }: Step3Props) {
  const origin = window.location.origin;

  const link = origin + `/habit/stake/${challengeId}?code=${accessCode}`;

  const text = 'Join my new challenge on Alibuda';

  const { shareOnX, shareOnFarcaster } = useSocialShare();

  return (
    <div className="xs:px-16 flex h-full w-full flex-col items-center justify-start px-8">
      <p className="text-bold px-4 py-4 text-center font-londrina text-2xl text-primary">
        Challenge Created!
      </p>

      <p className="text-grey-800 xs:p-4 text-center text-sm">
        Share it with your community and start the health challenge together!
      </p>

      <div className="mt-12 flex justify-between gap-2">
        <Button onClick={() => shareOnX(text, link)} endContent={<BsTwitterX />}>
          Share on
        </Button>
        <Button
          onClick={() => shareOnFarcaster(text, [link])}
          endContent={<Image alt="warp" src={farcasterLogo} width={25} height={25} />}
        >
          Share on
        </Button>
      </div>
      <Divider className="mx-8 my-4" />

      <Snippet
        className="rounded-xl p-2 px-4"
        size="sm"
        hideSymbol
        color="default"
        codeString={link}
      >
        <span> Copy Invite Link </span>
      </Snippet>

      <Link
        href={`/habit/stake/${challengeId}?code=${accessCode}`}
        className="mb-8 mt-28 w-full justify-center"
      >
        <Button className="min-h-12 w-full" color="primary">
          Start Challenge
        </Button>
      </Link>
    </div>
  );
}
