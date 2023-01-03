import { PartyCode } from '@common/types/partyCode';
import styles from '@style/components/partyHeader.module.scss';
import QrButton from './qrButton';

interface Props {
  partyName: string;
  partyCode: PartyCode;
}

export default function PartyHeader({ partyName, partyCode }: Props) {
  return (
    <div className={styles.container}>
      <div>
        <div>
          <QrButton partyCode={partyCode} />
        </div>
        <div>
          <p className='text-center'>Pin: {partyCode}</p>
        </div>
        <div></div>
      </div>
      <h1 className='text-center'>{partyName}</h1>
    </div>
  );
}