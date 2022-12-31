import QRCode from 'react-qr-code';
import styles from '../../styles/components/qrCodeModal.module.scss';

type ModalCloseListener = () => void;

interface Props {
  code: string;
  onModalClosed: ModalCloseListener;
}

const createRoomLink = (code: string) => {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const URL = `${origin}`;
  //TODO checken, ob der link mit der live url dann auch noch passt (auf localhost funktioniert es)
  return `${URL}/?partyCode=${code}`;
};

export default function QRCodeModal({
  code,
  onModalClosed,
}: Props): JSX.Element {
  return (
    <div className={styles.modal} onClick={onModalClosed}>
      <div className={styles.QRCodeContainer}>
        <QRCode value={createRoomLink(code)} />
      </div>
    </div>
  );
}
