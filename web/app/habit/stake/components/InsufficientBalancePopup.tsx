import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAccount } from 'wagmi';
import crypto from 'crypto';
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from '@gatefi/js-sdk';

import PopupWindow from '@/components/PopupWindow/PopupWindow';

type InsufficientBalancePopupProps = {
  onClose: () => void;
  onDepositClick: () => void;
};

function InsufficientBalancePopup({ onClose, onDepositClick }: InsufficientBalancePopupProps) {
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const { address: smartWallet } = useAccount();

  useEffect(() => {
    return () => {
      overlayInstanceSDK.current?.destroy();
      overlayInstanceSDK.current = null;
    };
  }, []);

  const handleOnrampClick = useCallback(() => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        console.log('is visible');
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        console.log('is not visible');
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = crypto.randomBytes(32).toString('hex');
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: `${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`,
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: '#overlay-button',
        lang: GateFiLangEnum.en_US,
        isSandbox: true,
        successUrl: window.location.href,
        walletAddress: smartWallet,
        externalId: randomString,
        defaultFiat: {
          currency: 'USD',
          amount: '20',
        },
        defaultCrypto: {
          currency: 'ETH',
        },
      });
    }
    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
  }, [isOverlayVisible, smartWallet]);

  const title = 'Insufficient Wallet Balance';

  const content = <div className="p-4">Please deposit or onramp to join the challenge.</div>;

  const buttons = useMemo(() => {
    return [
      {
        id: 'deposit',
        label: 'Deposit',
        onClick: onDepositClick,
        isPrimary: true,
      },
      {
        id: 'onramp',
        label: 'Onramp',
        onClick: handleOnrampClick,
        disabled: true,
        isPrimary: true,
      },
    ];
  }, [handleOnrampClick, onDepositClick]);

  return (
    <div>
      <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />
      <div id="overlay-button">{}</div>
    </div>
  );
}

InsufficientBalancePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDepositClick: PropTypes.func.isRequired,
};

export default InsufficientBalancePopup;
