import { parseAbi } from 'viem';
import toast from 'react-hot-toast';

import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useMintERC20 = (token: `0x${string}`, receiver: `0x${string}`, amount: bigint) => {
  return useSubmitTransaction(
    {
      address: token,
      abi: parseAbi(['function mint(address to, uint256 amount)']),
      functionName: 'mint',
      args: [receiver, amount],
    },
    {
      onError: (e) => {
        if (e) console.log('Error while Minting:', e);
        toast.error('Error minting test token. Please try again');
      },
      onSuccess: () => {
        //In the original file they refetch after success refetch();
        toast.dismiss();
        toast.success('USDC Minted!');
      },
      onSent: () => {
        toast.loading('Minting...');
      },
    },
  );
};

export default useMintERC20;
