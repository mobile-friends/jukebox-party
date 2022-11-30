import TrackView from '../components/elements/trackView';
import { Track } from '../lib/track';
import { Artist } from '../lib/artist';
import { Duration } from '../lib/duration';
import { PlaybackState } from '../lib/playbackState';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { currentlyPlaying, recentlyPlayed } from '../httpClient/spotify/player';

export default function Home({ context }) {
  let { data: session } = useSession() as any;
  const [currentTrack, setCurrentTrack] = useState<Track>(null);

  //TODO: Refactor
  useEffect(() => {
    console.log(session);
    getCurrentlyPlaying();
  }, [currentTrack]);

  const getCurrentlyPlaying = async () => {
    if (session?.user?.accessToken) {
      const result = await currentlyPlaying(session.user.accessToken);
      if (result) {
        console.log(result.item);
        var artists = [];
        result.item.artists.forEach((artist: any) => {
          artists.push(Artist.make(artist.name));
        });
        const track = Track.make(
          result.item.name,
          Duration.makeFromMiliSeconds(result.item.duration_ms),
          artists,
          result.item.album.images[1].url
        );
        setCurrentTrack(track);
      } else {
        console.log(
          'no Track is currently playing! Get recently Played Track!'
        );
        getRecentlyPlayed();
      }
    } else {
      console.log('waiting for session');
    }
  };

  const getRecentlyPlayed = async () => {
    const results = await recentlyPlayed(session?.user?.accessToken);
    console.log(results);
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
