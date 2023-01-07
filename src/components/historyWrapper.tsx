import React, { useEffect, useState } from 'react';
import { PartyCode } from '@common/types/partyCode';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import useLivePlaybackState from '@hook/useLivePlaybackState';
import { GetHistoryResult } from '@endpoint/getHistory';
import { History } from '@common/types/history';
import RatedTrackItem from './elements/ratedTrackItem';
import { RatedTrack } from '@common/types/ratedTrack';
import useLivePartyUsers from '@hook/useLivePartyUsers';

interface Props {
  partyCode: PartyCode;
  minified: boolean;
}

export default function HistoryWrappr({ partyCode, minified }: Props) {
  const playbackState = useLivePlaybackState(partyCode);
  const users = useLivePartyUsers(partyCode);
  const userAmount = users?.guests.length ? +users?.guests.length + 1 : 1;
  const [currentHistoryTracks, setCurrentHistoryTracks] = useState<
    RatedTrack[]
  >([]);

  useEffect(() => {
    JukeClient.getHistory(partyCode).then(onHistoryResult).catch(console.error);
  }, [partyCode, playbackState, minified]);

  function onHistoryResult(result: GetHistoryResult) {
    switch (result.code) {
      case StatusCodes.OK:
        return setCurrentHistoryTracks(result.content.history.tracks);
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_FOUND:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error [JUKE-142]
        break;
      default:
        return assertNeverReached(result);
    }
  }

  const tracks = currentHistoryTracks.map((ratedTrack: RatedTrack) => (
    <RatedTrackItem
      key={RatedTrack.idOf(ratedTrack)}
      ratedTrack={ratedTrack}
      userAmount={userAmount}
    />
  ));

  return (
    <div style={{ marginBottom: '84px' }}>
      {minified ? tracks.slice(0, 5) : tracks}
    </div>
  );
}
