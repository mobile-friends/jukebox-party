import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Input from '@component/elements/input';
import { Track } from '@common/types/track';
import styles from '../../../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next/types';
import Navbar from '@component/navbar';
import { PartyCode } from '@common/types/partyCode';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { JukeClient } from '@common/jukeClient';
import { SearchTracksResult } from '@endpoint/searchTracks';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import TrackItem from '@component/elements/trackItem';

interface Props {
  partyCode: PartyCode;
}

type QueryString = string & { _tag: 'QueryString' };

const MinQueryLength = 4;

function isValidQueryString(s: string): s is QueryString {
  return s.length >= MinQueryLength;
}

export default function AddTracks({ partyCode }: Props) {
  const [queryString, setQueryString] = useState<QueryString | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  useRouter();

  const onQueryInputChanged = async (input: string) => {
    const newQueryString = isValidQueryString(input) ? input : null;
    setQueryString(newQueryString);
  };

  function onSearchResult(result: SearchTracksResult) {
    switch (result.code) {
      case StatusCodes.OK:
        return setTracks(result.content.tracks);
      case StatusCodes.BAD_REQUEST:
      case StatusCodes.UNAUTHORIZED:
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors
        break;
      default:
        return assertNeverReached(result);
    }
  }

  useEffect(() => {
    if (queryString === null) return;

    JukeClient.searchTracks(partyCode, queryString)
      .then(onSearchResult)
      .catch(console.error);
  }, [partyCode, queryString]);

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          search.<span className='text-primary text-italic'>track</span>
        </h1>
        <div className={styles.container} style={{ padding: 0 }}>
          <Input
            type={'text'}
            placeholder='What do you want to listen to?'
            onChange={onQueryInputChanged}
          />
          <ul style={{ overflow: 'scroll' }}>
            {tracks?.map((track) => (
              <TrackItem key={Track.nameOf(track)} track={track} />
            ))}
          </ul>
        </div>
      </div>

      <Navbar partyCode={partyCode}/>
    </div>
  );
}

AddTracks.auth = true;

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
