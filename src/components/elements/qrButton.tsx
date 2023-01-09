import Button from './button';
import { HiOutlineQrCode } from 'react-icons/hi2';
import QRCodeModal from '@component/qrCodeModal';
import useToggle from '@hook/useToggle';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  partyCode: PartyCode;
}

export default function QrButton({ partyCode }: Props) {
  const [isModalVisible, toggleModalVisibility] = useToggle();

  return (
    <div>
      <Button
        styleType='icon-only small'
        content={<HiOutlineQrCode />}
        onClick={toggleModalVisibility}
      />

      {isModalVisible && (
        <QRCodeModal onClosed={toggleModalVisibility} partyCode={partyCode} />
      )}
    </div>
  );
}
