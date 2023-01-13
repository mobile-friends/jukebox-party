import firebaseDb from '@common/firebaseDb';
import { PartyDb } from '@common/partyDb';
import { ServersideSession } from '@common/serversideSession';
import { Party } from '@common/types/party';
import { PartyCode } from '@common/types/partyCode';
import PartyHeader from '@component/elements/partyHeader';
import LyricsWrapper from '@component/lyricsWrapper';
import Navbar from '@component/navbar';
import useLivePlaybackState from '@hook/useLivePlaybackState';
import { useWindowSize } from '@hook/useWindowSize';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import styles from '../../../styles/pages/party/home.module.scss';

interface Props {
  partyName: string;
  partyCode: PartyCode;
  isHost: boolean;
}

export default function PartyRoom({ partyName, partyCode, isHost }: Props) {
  const router = useRouter();
  const playbackState = useLivePlaybackState(partyCode);
  const windowSize = useWindowSize();

  function goToQueue() {
    router.push(`/party/${partyCode}/queue`).catch(console.error);
  }

  return (
    <div>
      <div className={styles.partyPage}>
        <PartyHeader
          partyName={partyName}
          partyCode={partyCode}
          isHost={isHost}
        />
        <div className={styles.partyContent}>
          {playbackState ? (
            <LyricsWrapper
              playTime={playbackState.playTime}
              track={playbackState.track}
            />
          ) : (
            <div className='text-center smaller_box'>
              <h2 className='text-primary'>
                Are you still listening on the same output device?
              </h2>
              <span>
                Press play on the output device of your choice (laptop,
                smartphone, ...), so we know which output device we may use.
              </span>
            </div>
          )}
        </div>
      </div>
      <Navbar partyCode={partyCode} />
    </div>
  );
}

PartyRoom.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = await ServersideSession.tryGetAuthUser(ctx);
  if (!user) {
    return { redirect: { destination: '/' }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, user.partyCode);
  if (PartyDb.isError(party))
    return {
      redirect: { destination: '/party/404' },
      props: {} as Props,
    };
  return {
    props: {
      partyName: Party.nameOf(party),
      partyCode: Party.codeOf(party),
      isHost: Party.hasHostWithId(party, user.id),
    },
  };
};
