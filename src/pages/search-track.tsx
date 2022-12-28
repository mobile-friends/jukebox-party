import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Input from '../components/elements/input';
import TrackListItemView from '../components/elements/trackListItemView';
import { Track } from '@common/types/track';
import styles from '../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next/types';
import Navbar from '../components/elements/navbar';
import { PartyCode } from '@common/types/partyCode';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { JukeClient } from '@common/jukeClient';

interface Props {
  partyCode: PartyCode;
}

type QueryString = string & { _tag: 'QueryString' };

const MinQueryLength = 4;

function isValidQueryString(s: string): s is QueryString {
  return s.length >= MinQueryLength;
}

export default function SearchTrack({ partyCode }: Props) {
  const [queryString, setQueryString] = useState<QueryString | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  useRouter();

  const onQueryInputChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const newQueryString = isValidQueryString(input) ? input : null;
    setQueryString(newQueryString);
  };

  useEffect(() => {
    if (queryString === null) return;

    JukeClient.searchTracks(partyCode, queryString)
      .then(setTracks)
      .catch((e) => {
        console.error(e);
        setTracks([]);
      });
  }, [queryString]);

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          search.<span className='text-primary text-italic'>track</span>
        </h1>
        <div className={styles.container} style={{ padding: 0 }}>
          <Input
            placeholder='What do you want to listen to?'
            onChange={onQueryInputChanged}
          />
          <ul style={{ overflow: 'scroll' }}>
            {tracks?.map((track) => (
              <TrackListItemView track={track} />
            ))}
          </ul>
        </div>
      </div>

      <Navbar partyCode={partyCode} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user ?? null;
  const party = user
    ? await PartyDb.tryGetByCode(firebaseDb, user.partyCode)
    : null;

  if (!(party && !PartyDb.isError(party))) {
    return {
      redirect: { destination: '/' }, // TODO: Add better non-auth page
      props: {} as Props,
    };
  }
  return {
    props: {
      partyCode: Party.codeOf(party),
    },
  };
};
