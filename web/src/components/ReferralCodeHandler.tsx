'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import storage from 'local-storage-fallback';

const REFERRAL_CODE_KEY = 'atomicHabitsReferralCode';

export function useReferralCode() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const storedCode = storage.getItem(REFERRAL_CODE_KEY);
    if (storedCode) {
      setReferralCode(storedCode);
    }
  }, []);

  /**
   * When referral code is detected in the URL, store it in local storage
   */
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      storage.setItem(REFERRAL_CODE_KEY, ref);
      setReferralCode(ref);
    }
  }, [searchParams]);

  const storeReferralCode = (code: string) => {
    storage.setItem(REFERRAL_CODE_KEY, code);
    setReferralCode(code);
  };

  return {
    referralCode,
    storeReferralCode,
  };
}

export default function ReferralCodeHandler() {
  useReferralCode();
  return null; // This component doesn't render anything
}
