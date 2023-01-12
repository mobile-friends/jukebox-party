import React, { useEffect, useState } from 'react';
import { Duration } from '@common/types/duration';
import { Track } from '@common/types/track';
import styles from '@style/components/lyricsWrapper.module.scss';
interface Props {
  playTime: Duration;
  track: Track;
}

export default function LyricsWrapper({ playTime, track }: Props) {
  const [lyrics, setLyrics] = useState<any>();
  const [trackId, setTrackId] = useState<string>('');
  const [currentLine, setCurrentLine] = useState<string>('');
  const [prevLine, setPrevLine] = useState<string>('');
  const [nextLine, setNextLine] = useState<string>('');
  const [dominantColors, setDominantColors] = useState<any>();

  const getColor = async (imageUrl: string) => {
    const response = await fetch(
      `https://lentoapi.herokuapp.com/dominantColor?url=${imageUrl}`
    ).catch((err) => console.log(err));
    const data = await response?.json();
    setDominantColors(data);
    return data;
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
        const lyrics = data?.lines?.map((line: any) => {
          return {
            startTime: parseInt(line.startTimeMs) / 1000,
            words: line.words,
          };
        });
        setLyrics(lyrics);
      })
      .catch(() => setLyrics(null));
  }, [track, trackId]);

  useEffect(() => {
    if (!lyrics) {
      setCurrentLine('No lyrics found');
      return;
    }
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
        <div
          className={styles.lyricsLine}
          style={{
            color: dominantColors?.hexDark,
          }}
        >
          {prevLine}
        </div>
        <div
          className={styles.lyricsLineCurrent}
          style={{
            color: dominantColors?.hexLight,
          }}
        >
          {currentLine}
        </div>
        <div
          className={styles.lyricsLine}
          style={{
            color: dominantColors?.hexDark,
          }}
        >
          {nextLine}
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={styles.lyricsNotFound}>
        <div>No lyrics found for this song.</div>
      </div>
    </>
  );
}
