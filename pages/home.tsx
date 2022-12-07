import TrackView from '../components/elements/trackView';
import { Track } from '../lib/track';
import { Artist } from '../lib/artist';
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

export default function Home({ context }) {
  let { data: session } = useSession() as any;
  const [currentTrack, setCurrentTrack] = useState<Track>(null);

  //TODO: Refactor
  useEffect(() => {
    console.log(session);
    getCurrentlyPlaying();
  }, [session, null]);

  useEffect(() => {
    getCurrentlyPlaying();
  }, [currentTrack]);

  const getCurrentlyPlaying = async () => {
    if (session?.user?.accessToken) {
      const result = await currentlyPlaying(session.user.accessToken);
      if (result) {
        const track = createTrack(result.item);
        console.log(track);
        setCurrentTrack(track);
      } else {
        console.log(
          'no Track is currently playing! Get recently played Track!'
        );
        getRecentlyPlayed();
      }
    } else {
      console.log('waiting for session');
    }
  };

  const getRecentlyPlayed = async () => {
    const results = await recentlyPlayed(session?.user?.accessToken);
    console.log(results.items);
    // const tracks = [];
    // results.items.forEach((item) => {
    //   tracks.push(item.track.id);
    // });
    // const artists = [];
    // results.items.forEach((item) => {
    //   item.track.artists.forEach((item) => {
    //     artists.push(item.id);
    //   });
    // });
    // console.log(tracks);
    // console.log(artists);
    // const recommendation = await recommendations(
    //   artists.toString(),
    //   tracks.toString(),
    //   session?.user?.accessToken
    // );
    // console.log(recommendation);
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
