import QRCode from 'react-qr-code';
import styles from '../../styles/components/qrCodeModal.module.scss';

interface Props {
  code: string;
  closeModal: () => void;
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

export default function QRCodeModal({ code, closeModal }: Props): JSX.Element {
  return (
    <div
      className={styles.modal}
      onClick={() => {
        closeModal();
      }}
    >
      <div className={styles.QRCodeContainer}>
        <QRCode value={createRoomLink(code)} />
      </div>
    </div>
  );
}
