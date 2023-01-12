import { PartyCode } from '@common/types/partyCode';
import styles from '@style/components/partyHeader.module.scss';
import AboutUsButton from './aboutUsButton';
import ExitButton from './exitButton';
import QrButton from './qrButton';
import UserListButton from './userListButton';

interface Props {
  partyName: string;
  partyCode: PartyCode;
  isHost: boolean;
}

export default function PartyHeader({ partyName, partyCode, isHost }: Props) {
  return (
    <div className={styles.container}>
      <div>
        <div>
          <ExitButton partyCode={partyCode} isHost={isHost} />
        </div>
        <div>
          <QrButton partyCode={partyCode} />
        </div>
        <div>
          <p className='text-center'>Pin: {partyCode}</p>
        </div>
        <div>
          <AboutUsButton />
        </div>
        <div>
          <UserListButton partyCode={partyCode} isHost={isHost} />
        </div>
      </div>

      <h1 className='text-center'>{partyName}</h1>
    </div>
  );
}
