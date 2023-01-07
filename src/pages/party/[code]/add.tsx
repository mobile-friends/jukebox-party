import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Input from '@component/elements/input';
import { Track } from '@common/types/track';
import styles from '../../../styles/pages/main.module.scss';
import { GetServerSideProps } from 'next/types';
import Navbar from '@component/navbar';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { JukeClient } from '@common/jukeClient';
import { SearchTracksResult } from '@endpoint/searchTracks';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import TrackItem from '@component/elements/trackItem';
import JukeHeader from '@component/elements/jukeHeader';
import { ServersideSession } from '@common/serversideSession';
import { signOut } from 'next-auth/react';
import { trace } from 'console';
import { GetRecommendationsResult } from '@endpoint/getRecommendations';

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
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);

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
        // TODO: Handle errors [JUKE-142]
        break;
      case StatusCodes.UNAUTHORIZED:
        // TODO: Redirect to better unauthorized page [JUKE-143]
        return signOut({ callbackUrl: '/' }).catch(console.error);
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors [JUKE-142]
        break;
      default:
        return assertNeverReached(result);
    }
  }

  function onRecommendationsResult(result: GetRecommendationsResult) {
    switch (result.code) {
      case StatusCodes.OK:
        return setRecommendedTracks(result.content.items);
      case StatusCodes.UNAUTHORIZED:
        // TODO: Redirect to better unauthorized page [JUKE-143]
        return signOut({ callbackUrl: '/' }).catch(console.error);
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors [JUKE-142]
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

  useEffect(() => {
    JukeClient.getRecommendations(partyCode)
      .then(onRecommendationsResult)
      .catch(console.error);
  }, [partyCode]);

  return (
    <div>
      <div className={styles.container}>
        <JukeHeader
          first={'search'}
          second={'track'}
          pageTitle={'Add | jukebox.party'}
        />
        <div className={styles.container} style={{ padding: 0 }}>
          <Input
            type={'text'}
            placeholder='What do you want to listen to?'
            onChange={onQueryInputChanged}
          />
          {!tracks.length && recommendedTracks?.length ? (
            <>
              <h1>Maybe you like</h1>
              <ul>
                {recommendedTracks?.map((track) => (
                  <TrackItem key={track.id} track={track} />
                ))}
              </ul>
            </>
          ) : (
            <>
              <ul style={{ overflow: 'scroll' }}>
                {tracks?.map((track) => (
                  <TrackItem key={track.id} track={track} />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <Navbar partyCode={partyCode} />
    </div>
  );
}

AddTracks.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const partyCode = await ServersideSession.tryGetPartyCode(ctx);
  if (!partyCode) {
    return { redirect: { destination: '/' }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);

  if (PartyDb.isError(party)) {
    return {
      redirect: { destination: '/' }, // TODO: Add better non-auth page [JUKE-143]
      props: {} as Props,
    };
  }
  return {
    props: {
      partyCode: Party.codeOf(party),
    },
  };
};
