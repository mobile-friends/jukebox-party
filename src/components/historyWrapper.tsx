import React, { useEffect, useState } from 'react';
import { Track } from '@common/types/track';
import { PartyCode } from '@common/types/partyCode';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import TrackItem from '@component/elements/trackItem';
import useLivePlaybackState from '@hook/useLivePlaybackState';
import { GetHistoryResult } from '@endpoint/getHistory';

interface Props {
  partyCode: PartyCode;
  minified: boolean;
}

export default function HistoryWrappr({ partyCode, minified }: Props) {
  const playbackState = useLivePlaybackState(partyCode);
  const [currentHistoryTracks, setCurrentHistoryTracks] = useState<Track[]>([]);

  function onQueueResult(result: GetHistoryResult) {
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
    JukeClient.getHistory(partyCode).then(onQueueResult).catch(console.error);
  }, [partyCode, playbackState, minified]);

  const tracks = currentHistoryTracks.map((track: Track) => (
    <TrackItem key={Track.nameOf(track)} track={track} />
  ));

  return <div>{minified ? tracks.slice(0, 5) : tracks}</div>;
}
