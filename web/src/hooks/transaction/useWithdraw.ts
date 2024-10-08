import toast from 'react-hot-toast';

import { abi } from '@/abis/challenge';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { challengeAddr } from '@/constants';
import { logEvent } from '@/utils/gtag';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useWithdraw = (needSettle: boolean, challengeId: bigint, onSuccess?: () => void) => {
  const txConfig = needSettle
    ? {
        contracts: [
          {
            address: challengeAddr,
            abi: abi,
            functionName: 'settle',
            args: [challengeId],
          },
          {
            address: challengeAddr,
            abi: abi,
            functionName: 'withdraw',
            args: [challengeId],
          },
        ],
      }
    : {
        address: challengeAddr,
        abi: abi,
        functionName: 'withdraw',
        args: [challengeId],
      };

  return useSubmitTransaction(txConfig, {
    onError: (error) => {
      toast.error('Error while claiming', { id: 'claim' });
    },
    onSuccess: () => {
      //In the orginal file they refetch after success refetch();
      toast.success('Successfully Claimed!', { id: 'claim' });
      logEvent({ action: 'claim', category: 'challenge', label: 'claim', value: 1 });
      onSuccess?.();
    },
    onSent: () => {
      toast.loading('Claiming...', { id: 'claim' });
    },
  });
};

export default useWithdraw;
