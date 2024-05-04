'use client';

import Image from 'next/image';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

const img = require('../../../src/imgs/step3.png') as string;
const map = require('../../../src/imgs/map.png') as string;

export default function Step3CheckIn({
  setSteps,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
}) {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full items-center justify-start gap-6">
        <Image
          src={img}
          width="50"
          alt="Step 2 Image"
          className="mb-3 rounded-full object-cover "
        />
        <p className="mr-auto text-lg text-gray-700">Check in every day</p>
      </div>

      <div className="font-xs pt-4 text-center">Scan the NFC at the pinged spot!</div>
      <Image src={map} width="300" alt="Map" className="mb-3 object-cover " />

      <button
        type="button"
        className="mt-4 rounded-lg bg-yellow-500 px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => {
          console.log('Juno please do NFC');
        }}
      >
        {' '}
        Tap Here and Tap NFC{' '}
      </button>
    </div>
  );
}