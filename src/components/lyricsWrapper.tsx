import React, { useEffect, useState } from 'react';
import { Duration } from '@common/types/duration';
import { Track } from '@common/types/track';

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

  useEffect(() => {
    if (track.id === trackId) return;
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
        console.log(lyrics);
      });
  }, [track]);

  useEffect(() => {
    if (!lyrics || lyrics?.error) return;
    const line = lyrics.reduce((prev: any, curr: any) => {
      return Math.abs(curr.startTime - playTime) <
        Math.abs(prev.startTime - playTime)
        ? curr
        : prev;
    });
    const prevLine = lyrics[lyrics.indexOf(line) - 1]?.words;
    const nextLine = lyrics[lyrics.indexOf(line) + 1]?.words;
    setCurrentLine(line.words);
    setPrevLine(prevLine);
    setNextLine(nextLine);
    console.log({
      prevLine,
      currentLine: line.words,
      nextLine,
    });
  }, [playTime]);

  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        flexFlow: 'column',
        padding: '2rem',
        background:
          'linear-gradient(90deg, rgba(255,208,5,1) 0%, rgba(236,227,47,1) 100%)',
        gap: '1rem',
        borderRadius: '1rem',
      }}
    >
      <div
        style={{
          display: 'block',
          textAlign: 'center',
          color: '#7b761a',
          fontSize: '1.2rem',
        }}
      >
        {prevLine}
      </div>
      <div
        style={{
          display: 'block',
          textAlign: 'center',
          color: '#191919',
          fontWeight: '600',
          fontSize: '1.5rem',
        }}
      >
        {currentLine}
      </div>
      <div
        style={{
          display: 'block',
          textAlign: 'center',
          color: '#7b761a',
          fontSize: '1.2rem',
        }}
      >
        {nextLine}
      </div>
    </div>
  );
}
