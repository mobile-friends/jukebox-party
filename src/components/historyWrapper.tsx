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

interface Props {
  partyCode: PartyCode;
  minified: boolean;
}

export default function HistoryWrappr({ partyCode, minified }: Props) {
  const playbackState = useLivePlaybackState(partyCode);
  const [currentHistoryTracks, setCurrentHistoryTracks] = useState<
    RatedTrack[]
  >([]);

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

  useEffect(() => {
    JukeClient.getHistory(partyCode).then(onHistoryResult).catch(console.error);
  }, [partyCode, playbackState, minified]);

  const tracks = currentHistoryTracks.map((ratedTrack: RatedTrack) => (
    <RatedTrackItem
      key={RatedTrack.nameOf(ratedTrack)}
      ratedTrack={ratedTrack}
    />
  ));

  return (
    <div style={{ marginBottom: '84px' }}>
      {minified ? tracks.slice(0, 5) : tracks}
    </div>
  );
}
