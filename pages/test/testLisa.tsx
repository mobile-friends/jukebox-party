import TrackView from '../../components/elements/trackView';
import { Track } from '../../lib/track';
import { Duration } from '../../lib/duration';
import { PlaybackState } from '../../lib/playbackState';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  currentlyPlaying,
  recentlyPlayed,
} from '../../httpClient/spotify/player';
import { createTrack } from '../../utils/createTrack';
import { recommendations } from '../../httpClient/spotify/browse';
import { createSeeds } from '../../utils/recommendationSeeds';

export default function Home() {
  let { data: session } = useSession() as any;
  const [currentTrack, setCurrentTrack] = useState<Track>();

  useEffect(() => {
    console.log(session);
    const interval = setInterval(() => {
      getCurrentlyPlaying();
    }, 5000);

    return () => clearInterval(interval);
  }, [session]);

  const getCurrentlyPlaying = async () => {
    if (session?.user?.accessToken) {
      const result = await currentlyPlaying(session.user.accessToken);
      if (result) {
        const track = createTrack(result.item);
        setCurrentTrack(track);
      } else {
        console.log(
          'no Track is currently playing! Getting recently played Track!'
        );
        getRecentlyPlayed();
      }
    } else {
      console.log('waiting for session');
    }
  };

  const getRecentlyPlayed = async () => {
    const results = await recentlyPlayed(session?.user?.accessToken);
    const seeds = createSeeds(results);
    const recommendation = await recommendations(
      //TODO: not working with array, only working with one id
      seeds.artists.substring(0, seeds.artists.indexOf(',')),
      seeds.tracks.substring(0, seeds.tracks.indexOf(',')),
      session?.user?.accessToken
    );
    console.log(recommendation.tracks[0]);
  };

  return (
    <div>
      <h1>Home</h1>
      {currentTrack ? (
        <TrackView
          track={currentTrack}
          playbackState={PlaybackState.makePlaying(Duration.Zero)}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
