import { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { Snippet } from '@nextui-org/snippet';
import { Select, SelectItem } from '@nextui-org/select';
import { useAccount } from 'wagmi';

import usdc from '@/imgs/coins/usdc.png';
import Image from 'next/image';

type DepositPopupProps = {
  onClose: () => void;
};

function DepositPopup({ onClose }: DepositPopupProps) {
  const { address } = useAccount();

  const [selectedToken, setSelectedToken] = useState<string>('usdc');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('base');

  const handleTokenChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys).join(', ');
    setSelectedToken(selectedKey);
  }, []);

  const handleNetworkChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys).join(', ');
    setSelectedNetwork(selectedKey);
  }, []);

  const buttons = useMemo(
    () => [
      {
        id: 'depositViaBinance',
        label: 'Deposit via Binance',
        onClick: onClose,
        disabled: true,
        isPrimary: true,
      },
    ],
    [onClose],
  );

  const title = 'Deposit';

  const tokens = [
    // { key: 'eth', label: 'ETH' },
    { key: 'usdc', label: 'USDC', icon: usdc },
  ];

  const networks = [
    // { key: 'eth', label: 'Ethereum' },
    // { key: 'op', label: 'Optimism' },
    { key: 'base', label: 'Base' },
  ];

  const content = (
    <div className="text-left">
      <div className="mb-2 flex items-center">
        <label htmlFor="token" className="mr-2 w-1/3 font-bold">
          Token
        </label>
        <Select
          labelPlacement="outside-left"
          variant="bordered"
          radius="sm"
          className="w-2/3 max-w-xs rounded p-2"
          selectedKeys={new Set([selectedToken])}
          onSelectionChange={handleTokenChange}
        >
          {tokens.map((token) => (
            <SelectItem
              key={token.key}
              startContent={<Image src={token.icon} height={20} width={20} alt="token" />}
            >
              {token.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="mb-4 flex items-center">
        <label htmlFor="network" className="mr-2 w-1/3 font-bold">
          Network
        </label>
        <Select
          labelPlacement="outside-left"
          variant="bordered"
          radius="sm"
          className="w-2/3 max-w-xs rounded p-2"
          selectedKeys={new Set([selectedNetwork])}
          onSelectionChange={handleNetworkChange}
        >
          {networks.map((network) => (
            <SelectItem key={network.key}>{network.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="mb-4">
        <label htmlFor="depositAddress" className="mb-2 block font-bold">
          Deposit Address:
        </label>
        <div id="depositAddress" className="mt-1 break-all rounded">
          <Snippet symbol="" color="default">
            <span className="whitespace-normal break-all">{address}</span>
          </Snippet>
        </div>
      </div>
    </div>
  );

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

DepositPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DepositPopup;
