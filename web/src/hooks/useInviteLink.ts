'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';

function useInviteLink(challengeId?: number, accessCode?: string) {
  const { address } = usePasskeyAccount();
  const [origin, setOrigin] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (address) {
      fetchOrGenerateReferralCode();
    }
  }, [address]);

  const fetchOrGenerateReferralCode = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/referral?address=${address}`);
      const data = await response.json();
      if (data.referralCode) {
        setReferralCode(data.referralCode);
      } else {
        // If no referral code exists, generate a new one
        const newCode = await generateReferralCode();
        setReferralCode(newCode);
      }
    } catch (error) {
      console.error('Error fetching or generating referral code:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const generateReferralCode = useCallback(async () => {
    if (!address) return null;
    try {
      const response = await fetch('/api/user/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      if (data.referralCode) {
        return data.referralCode;
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast.error('Failed to generate referral code');
    }
    return null;
  }, [address]);

  const getInviteLink = useCallback(() => {
    if (!referralCode) return '';

    let link = `${origin}`;

    if (challengeId) {
      link += `/habit/stake/${challengeId}`;
      if (accessCode) {
        link += `?code=${accessCode}`;
      }
      link += `${accessCode ? '&' : '?'}ref=${referralCode}`;
    } else {
      link += `?ref=${referralCode}`;
    }

    return link;
  }, [origin, referralCode, challengeId, accessCode]);

  const copyInviteLink = useCallback(() => {
    const link = getInviteLink();
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success('Invite link copied to clipboard');
    } else {
      toast.error('Unable to generate invite link');
    }
  }, [getInviteLink]);

  return {
    referralCode,
    isLoading,
    getInviteLink,
    copyInviteLink,
  };
}

export default useInviteLink;