import QRCode from 'react-qr-code';
import styles from '../../styles/components/qrCodeModal.module.scss';

interface InputProps {
  code: string;
  closeModal: () => void;
}

export default function QRCodeModal({
  code,
  closeModal,
}: InputProps): JSX.Element {
  return (
    <div
      className={styles.modal}
      onClick={() => {
        closeModal();
      }}
    >
      <div className={styles.QRCodeContainer}>
        <QRCode value={code} />
      </div>
    </div>
  );
}
