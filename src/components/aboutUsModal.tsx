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
          <p>
            Jukebox.party was created during a project at the University of
            Applied Sciences St. Pölten.
          </p>
          <br />
          <p>
            As part of our Masters Programm Interactive Technologies, within the
            Masterclass Mobile, we had to implement a group project during the
            whole semester.
          </p>
          <p>
            Within this time we, seven studens, came up with the idea and
            implemented Jukebox.party with Next.js.
          </p>
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
