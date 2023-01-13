import firebaseDb from '@common/firebaseDb';
import { JukeClient } from '@common/jukeClient';
import { PartyDb } from '@common/partyDb';
import { ServersideSession } from '@common/serversideSession';
import { Party } from '@common/types/party';
import { PartyCode } from '@common/types/partyCode';
import { Track } from '@common/types/track';
import { assertNeverReached } from '@common/util/assertions';
import Input from '@component/elements/input';
import JukeHeader from '@component/elements/jukeHeader';
import TrackItem from '@component/elements/trackItem';
import Navbar from '@component/navbar';
import { GetRecommendationsResult } from '@endpoint/getRecommendations';
import { SearchTracksResult } from '@endpoint/searchTracks';
import { StatusCodes } from 'http-status-codes';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useEffect, useLayoutEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import styles from '../../../styles/pages/main.module.scss';
import { PagePath } from '@common/pagePath';

interface Props {
  partyCode: PartyCode;
}

type QueryString = string & { _tag: 'QueryString' };

const MinQueryLength = 4;

function isValidQueryString(s: string): s is QueryString {
  return s.length >= MinQueryLength;
}

export default function AddTracksPage({ partyCode }: Props) {
  const [queryString, setQueryString] = useState<QueryString | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);

  // TODO - remove this artifical loading time after fixing useEffect calling twice error
  const [showRecommendations, setShowRecommendations] = useState(false);
  setTimeout(() => {
    setShowRecommendations(true);
  }, 2500);

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
        return signOut({ callbackUrl: PagePath.Home }).catch(console.error);
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
        return signOut({ callbackUrl: PagePath.Home }).catch(console.error);
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

  useLayoutEffect(() => {
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
              <h1>Maybe you like:</h1>
              {showRecommendations ? (
                <ul>
                  {recommendedTracks?.map((track) => (
                    <TrackItem
                      key={track.id}
                      track={track}
                      canBeQueued={true}
                      partyCode={partyCode}
                    />
                  ))}
                </ul>
              ) : (
                <>
                  <ReactLoading
                    className={styles.loading}
                    type={'bubbles'}
                    color={'white'}
                    height={'50%'}
                    width={'50%'}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <ul style={{ overflow: 'scroll' }}>
                {tracks?.map((track) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    canBeQueued={true}
                    partyCode={partyCode}
                  />
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

AddTracksPage.auth = true;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const partyCode = await ServersideSession.tryGetPartyCode(ctx);
  if (!partyCode) {
    return { redirect: { destination: PagePath.Home }, props: {} as Props };
  }
  const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);

  if (PartyDb.isError(party)) {
    return {
      redirect: { destination: PagePath.Home }, // TODO: Add better non-auth page [JUKE-143]
      props: {} as Props,
    };
  }
  return {
    props: {
      partyCode: Party.codeOf(party),
    },
  };
};
