import { Duration } from '@common/types/duration';
import { Track } from '@common/types/track';
import styles from '@style/components/lyricsWrapper.module.scss';
import { useEffect, useState } from 'react';

interface Props {
  playTime: Duration;
  track: Track;
  showInfo: boolean;
}

const getNoLyricsFound = () => {
  const noLyricsFound = [
    "In this tune, you'll need to freestyle with the words.",
    'This melody calls for some impromptu lyricism.',
    'Time to wing it with the lyrics on this one.',
    'Get ready to improvise like a jazz musician with the words in this song.',
    'The lyrics in this song are a blank canvas, go forth and paint a masterpiece',
    'This song is like a game of Mad Libs, but with lyrics.',
    'The lyrics in this song are like a choose your own adventure book, make your own story.',
    'In this song, the lyrics are like a game of Jenga, build it up as you go.',
    'The words in this song are like clay, mold them into something great.',
    'This song is like a game of telephone, pass on the lyrics and see how it changes',
  ];
  return noLyricsFound[Math.floor(Math.random() * noLyricsFound.length)];
};

export default function LyricsWrapper({
  playTime,
  track,
  showInfo = false,
}: Props) {
  const [lyrics, setLyrics] = useState<any>();
  const [trackId, setTrackId] = useState<string>('');
  const [currentLine, setCurrentLine] = useState<string>('');
  const [prevLine, setPrevLine] = useState<string>('');
  const [nextLine, setNextLine] = useState<string>('');
  const [dominantColors, setDominantColors] = useState<any>();
  const [noLyricsText, setNoLyricsText] = useState<string>(getNoLyricsFound());

  const getColor = async (imageUrl: string) => {
    const response = await fetch(
      `https://lentoapi.herokuapp.com/dominantColor?url=${imageUrl}`
    ).catch((err) => console.log(err));
    const data = await response?.json();
    setDominantColors(data);
    return data;
  };

  const showLyricsInfo = () => {
    return showInfo ? (
      <div className={styles.lyricsInfo}>
        <img src={track.albumArtUrl}></img>
        <div>
          <b>{track.name}</b> <br></br>
          <span>{track.artists.map((a) => a.name).join(', ')}</span>
        </div>
      </div>
    ) : (
      <></>
    );
  };

  useEffect(() => {
    if (track.id === trackId) return;
    getColor(track.albumArtUrl);
    setTrackId(track.id?.toString() as string);
    fetch(`https://spotify-lyric-api.herokuapp.com/?trackid=${track.id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error || data.syncType === 'UNSYNCED') {
          setNoLyricsText(getNoLyricsFound);
          return setLyrics(null);
        }
        const lyrics = data?.lines?.map((line: any) => {
          return {
            startTime: parseInt(line.startTimeMs) / 1000,
            words: line.words,
          };
        });
        setLyrics(lyrics);
      })
      .catch(() => {
        setNoLyricsText(getNoLyricsFound);
        setLyrics(null);
      });
  }, [track, trackId]);

  useEffect(() => {
    if (!lyrics) return;
    const currentLine = lyrics.reduce((prev: any, curr: any) => {
      return Math.abs(curr.startTime - playTime) <
        Math.abs(prev.startTime - playTime)
        ? curr
        : prev;
    });
    const prevLine = lyrics[lyrics.indexOf(currentLine) - 1]?.words;
    const nextLine = lyrics[lyrics.indexOf(currentLine) + 1]?.words;
    setCurrentLine(currentLine.words);
    setPrevLine(prevLine);
    setNextLine(nextLine);
  }, [playTime, lyrics]);

  return lyrics ? (
    <>
      <div
        className={styles.lyricsWrapper}
        style={{
          background: `linear-gradient(120deg,${dominantColors?.hex} 0%, ${dominantColors?.hexDark} 120%`,
        }}
      >
        {showLyricsInfo()}
        <div
          className={styles.lyricsLine}
          style={{
            color: dominantColors?.hexDark,
          }}
        >
          {prevLine ? prevLine : '♪'}
        </div>
        <div
          className={styles.lyricsLineCurrent}
          style={{
            color: dominantColors?.hexLight,
          }}
        >
          {currentLine ? currentLine : '♪'}
        </div>
        <div
          className={styles.lyricsLine}
          style={{
            color: dominantColors?.hexDark,
          }}
        >
          {nextLine ? nextLine : currentLine ? '♪' : 'greetings your jukebot ♫'}
        </div>
      </div>
    </>
  ) : (
    <>
      <div
        className={styles.lyricsWrapper}
        style={{
          background: `linear-gradient(120deg,${dominantColors?.hex} 0%, ${dominantColors?.hexDark} 120%`,
        }}
      >
        {showLyricsInfo()}
        <div
          className={styles.lyricsLine}
          style={{
            color: dominantColors?.hexDark,
          }}
        >
          ♩♪♫♬
        </div>
        <div
          className={styles.lyricsLineCurrent}
          style={{
            color: dominantColors?.hexLight,
          }}
        >
          {noLyricsText}
        </div>
        <div
          className={styles.lyricsLine}
          style={{
            color: dominantColors?.hexDark,
          }}
        >
          greetings your jukebot ♫
        </div>
      </div>
    </>
  );
}
