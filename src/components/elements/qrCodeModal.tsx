import QRCode from 'react-qr-code';
import styles from '../../styles/components/qrCodeModal.module.scss';
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
  onModalClosed: ModalCloseListener;
}

function createPartyLink(partyCode: PartyCode): string {
  const origin = useLocation().origin;
  //TODO checken, ob der link mit der live url dann auch noch passt (auf localhost funktioniert es)
  return `${origin}/?partyCode=${partyCode}`;
}

/**
 * A QR-code modal with a link to a party
 * @constructor
 */
export default function QRCodeModal({ partyCode, onModalClosed }: Props) {
  const link = createPartyLink(partyCode);
  return (
    <div className={styles.modal} onClick={onModalClosed}>
      <div className={styles.QRCodeContainer}>
        <QRCode value={link} />
      </div>
    </div>
  );
}
