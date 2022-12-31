import QRCode from 'react-qr-code';
import styles from '../../styles/components/qrCodeModal.module.scss';
import { PartyCode } from '@common/types/partyCode';

type ModalCloseListener = () => void;

interface Props {
  partyCode: PartyCode;
  onModalClosed: ModalCloseListener;
}

function createRoomLink(partyCode: PartyCode) {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const URL = `${origin}`;
  //TODO checken, ob der link mit der live url dann auch noch passt (auf localhost funktioniert es)
  return `${URL}/?partyCode=${partyCode}`;
}

export default function QRCodeModal({ partyCode, onModalClosed }: Props) {
  return (
    <div className={styles.modal} onClick={onModalClosed}>
      <div className={styles.QRCodeContainer}>
        <QRCode value={createRoomLink(partyCode)} />
      </div>
    </div>
  );
}
