import TrackView from '../../components/elements/trackView';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { PlaybackState } from '../../lib/playbackState';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  currentlyPlaying,
  playbackState,
  recentlyPlayed,
} from '../../httpClient/spotify/player';
import { createTrack } from '../../utils/createTrack';
import { recommendations } from '../../httpClient/spotify/browse';

export default function Home() {
  let { data: session } = useSession() as any;
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [playbackProgress, setPlaybackProgress] = useState<Duration>(
    Duration.Zero
  );

  useEffect(() => {
    if (!session) return;

    getCurrentlyPlaying();
    const interval = setInterval(getCurrentlyPlaying, 5000);

    getPlaybackState();
    const intervalPlayback = setInterval(getPlaybackState, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(intervalPlayback);
    };
  }, [session]);

  const getCurrentlyPlaying = async () => {
    try {
      const result = await currentlyPlaying(session?.user?.accessToken);
      if (result) {
        setCurrentTrack(createTrack(result.item));
      } else {
        console.log('no Track is currently playing! Getting Recommendation!');
        getRecentlyPlayedRecommendation();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRecentlyPlayedRecommendation = async () => {
    try {
      const results = await recentlyPlayed(session?.user?.accessToken);
      const recommendation = await recommendations(
        results.items.map((item: any) => item.track.id).join(','),
        session?.user?.accessToken
      );
      console.log('Recommendation: ', recommendation.tracks[0]);
      //TODO: add to Queue
    } catch (error) {
      console.error(error);
    }
  };

  const getPlaybackState = async () => {
    try {
      const result = await playbackState(session?.user?.accessToken);
      if (!result) return;
      const progressDuration: Duration = Duration.makeFromMiliSeconds(
        result.progress_ms
      );
      setPlaybackProgress(progressDuration);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      {currentTrack ? (
        <TrackView
          track={currentTrack}
          playbackState={PlaybackState.makePlaying(playbackProgress)}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
