import styles from '@style/components/aboutUsModal.module.scss';
import Button from './elements/button';
import { BaseSyntheticEvent } from 'react';

type ModalCloseListener = () => void;

interface Props {
  onClosed: ModalCloseListener;
}

export default function AboutUsModal({ onClosed }: Props) {
  function handleClick(e: BaseSyntheticEvent) {
    const targetClassName: string = e.target.className;
    if (
      typeof targetClassName === 'string' &&
      targetClassName.includes('background_clickable')
    ) {
      onClosed();
    }
  }

  return (
    <div className={styles.background_clickable} onClick={handleClick}>
      <div className={styles.modal}>
        <div>
          <h2 className='text-center'>
            about jukebox.
            <span className='text-italic text-primary'>party</span>
          </h2>
          <h3 className='text-center'>and the people that created this app</h3>
        </div>

        <div className={styles.textBlock}>
          <br></br>
          <p>
            Jukebox is an app built by a group of students that allows for group
            sessions on Spotify. Perfect for parties and other social
            gatherings, Jukebox allows multiple users to add and vote on songs
            in real-time, creating the ultimate collaborative music experience.
            With the power of Spotify's extensive library and easy-to-use
            interface, Jukebox makes it simple for friends and family to come
            together and create the perfect soundtrack for any occasion. Plus,
            it's easy for others to join your session through the use of a
            unique QR code.
          </p>
          <br></br>
          <p>
            Team: Eva Altenburger, Ramon Brullo, Lukas Ganster, Fabian Gaugusch,
            Michelle Markl, Lisa Polena, Alexander Schuster
          </p>
          <br></br>
          <span>Version 1.0 (last updated 17.January 2023) - </span>
          <a
            style={{ color: 'white' }}
            target='_blank'
            href='https://www.fhstp.ac.at/en/legal-information/legal-information?set_language=en'
            rel='noreferrer'
          >
            Legal information
          </a>
        </div>

        <div>
          <Button
            styleType='secondary block'
            content='Close'
            onClick={onClosed}
          />
        </div>
      </div>
    </div>
  );
}
