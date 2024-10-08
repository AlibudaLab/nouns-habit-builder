import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { Snippet } from '@nextui-org/snippet';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';

import { Checkbox } from '@nextui-org/react';
import { logEventSimple } from '@/utils/gtag';

const addressMask = '**************************************';

type DepositPopupProps = {
  onClose: () => void;
};

function DepositPopup({ onClose }: DepositPopupProps) {
  const { address } = usePasskeyAccount();

  const [confirmBox1Checked, setConfirmBox1Checked] = useState(false);
  const [confirmBox2Checked, setConfirmBox2Checked] = useState(false);

  const buttons = useMemo(() => [], []);

  const title = 'Deposit';

  const content = (
    <div className="text-left">
      <div className="mx-2 flex justify-start gap-2">
        <Checkbox
          className="font-nunito text-xs text-gray-600"
          size="sm"
          isSelected={confirmBox1Checked}
          onValueChange={setConfirmBox1Checked}
        />
        <span className="text-start font-londrina text-sm text-gray-500">
          I confirm that I will deposit <span className="font-bold">USDC</span> only. No other
          tokens allowed! 🪙
        </span>
      </div>
      <div className="mx-2 mt-4 flex justify-start gap-2">
        <Checkbox
          className="font-nunito text-xs text-gray-600"
          size="sm"
          isSelected={confirmBox2Checked}
          onValueChange={setConfirmBox2Checked}
        />
        <span className="text-start font-londrina text-sm text-gray-500">
          I understand this deposit is exclusively for the{' '}
          <span className="font-bold">Base network</span>. 🚀
        </span>
      </div>
      <div className="my-8">
        <label htmlFor="depositAddress" className="m-2 block font-bold">
          Deposit Address:
        </label>
        <div id="depositAddress" className="m-2">
          <Snippet
            symbol=""
            color="default"
            onClick={() => {
              logEventSimple({ eventName: 'click_copy_address', category: 'others' });
            }}
            className="w-full max-w-full"
          >
            <div className="w-full whitespace-normal break-all">
              <span className="font-nunito text-xs">
                {confirmBox1Checked && confirmBox2Checked ? address : addressMask}
              </span>
            </div>
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
