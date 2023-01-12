import { PartyCode } from '@common/types/partyCode';
import { useLocation } from '@hook/useLocation';
import styles from '@style/components/partyHeader.module.scss';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AboutUsButton from './aboutUsButton';
import ExitButton from './exitButton';
import QrButton from './qrButton';
import UserListButton from './userListButton';
import 'react-toastify/dist/ReactToastify.css';
import { FaCopy } from 'react-icons/fa';
import { lchown } from 'fs/promises';

interface Props {
  partyName: string;
  partyCode: PartyCode;
  isHost: boolean;
}

export default function PartyHeader({ partyName, partyCode, isHost }: Props) {
  const [partyLink, setPartyLink] = useState<string>('');
  const notify = () =>
    toast('Link copied!', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const origin = useLocation().origin;
    setPartyLink(`${origin}/?partyCode=${partyCode}`);
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <div>
          <ExitButton partyCode={partyCode} isHost={isHost} />
        </div>
        <div>
          <QrButton partyCode={partyCode} />
        </div>
        <div
          className={styles.partyCodeContainer}
          onClick={() => {
            navigator.clipboard.writeText(
              partyLink !== '' ? partyLink : partyCode
            );
            notify();
          }}
        >
          <p className='text-center'>Pin: {partyCode}</p>
          <FaCopy size={15} />
        </div>
        <div>
          <AboutUsButton />
        </div>
        <div>
          <UserListButton partyCode={partyCode} isHost={isHost} />
        </div>
      </div>

      <h1 className='text-center'>{partyName}</h1>
      <ToastContainer />
    </div>
  );
}
