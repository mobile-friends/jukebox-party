import QRCode from 'react-qr-code';
import styles from '@style/components/qrCodeModal.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { useLocation } from '@hook/useLocation';

type ModalCloseListener = () => void;

interface Props {
  /**
   * The code of the party to link to
   */
  partyCode: PartyCode;
  /**
   * A listener for when the modal closed
   */
  onClosed: ModalCloseListener;
}

/**
 * A QR-code modal with a link to a party
 * @constructor
 */
export default function QRCodeModal({ partyCode, onClosed }: Props) {
  const origin = useLocation().origin;
  // TODO: checken, ob der link mit der live url dann auch noch passt
  // (auf localhost funktioniert es)
  const link = `${origin}/?partyCode=${partyCode}`;

  return (
    <div className={styles.background} onClick={onClosed}>
      <div className={styles.modal}>
        <h2 className='text-center'>Scan the party code</h2>
        <div className={styles.QRCodeContainer}>
          <QRCode value={link} />
        </div>
        <p className='text-center'>
          Direct code to the party, you only have to enter your name then
        </p>
      </div>
    </div>
  );
}
