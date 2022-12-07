import TrackView from '../components/elements/trackView';
import { Track } from '../lib/track';
import { Duration } from '../lib/duration';
import { PlaybackState } from '../lib/playbackState';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  currentlyPlaying,
  recentlyPlayed,
  recommendations,
} from '../httpClient/spotify/player';
import { createTrack } from '../utils/createTrack';

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
        //getRecentlyPlayed();
      }
    } else {
      console.log('waiting for session');
    }
  };

  const getRecentlyPlayed = async () => {
    const results = await recentlyPlayed(session?.user?.accessToken);
    const tracks: string[] = [];
    results.items.forEach((item: { track: { id: string } }) => {
      tracks.push(item.track.id);
    });
    const artists: string[] = [];
    results.items.forEach((item: { track: { artists: any[] } }) => {
      item.track.artists.forEach((item) => {
        artists.push(item.id);
      });
    });
    // console.log(tracks);
    // console.log(artists);
    const recommendation = await recommendations(
      artists.toString(),
      tracks.toString(),
      session?.user?.accessToken
    );
    console.log(recommendation);
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
