import styles from '@style/components/userListModal.module.scss';
import Button from './elements/button';
import { BaseSyntheticEvent } from 'react';

type ModalCloseListener = () => void;

interface Props {
  onClosed: ModalCloseListener;
}

export default function AboutUsModal({ onClosed }: Props) {
  function handleClick(e: BaseSyntheticEvent) {

    const targetClassName: string = e.target.className;
    if(typeof(targetClassName) === 'string' && targetClassName.includes('background_clickable')) {
      onClosed();
    }
  }

  return (
    <div className={styles.background_clickable} onClick={handleClick}>
      <div className={styles.modal}>
        <h2 className='text-center'>
          The party.<span className='text-italic text-primary'>people</span>
        </h2>

        <p>Test</p>

        <div className={styles.closebar}>
          <Button styleType='secondary block' content='Close' onClick={onClosed} />
        </div>
      </div>
    </div>
  );
}
