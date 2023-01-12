import Button from './button';
import { RxExit } from 'react-icons/rx';
import useToggle from '@hook/useToggle';
import { PartyCode } from '@common/types/partyCode';
import ExitModal from '@component/exitModal';

interface Props {
  partyCode: PartyCode;
  isHost: boolean;
}

export default function ExitButton({ partyCode, isHost }: Props) {
  const [isModalVisible, toggleModalVisibility] = useToggle();

  return (
    <div>
      <Button
        styleType='icon-only small'
        content={<RxExit />}
        onClick={toggleModalVisibility}
      />

      {isModalVisible && (
        <ExitModal
          onClosed={toggleModalVisibility}
          partyCode={partyCode}
          isHost={isHost}
        />
      )}
    </div>
  );
}
