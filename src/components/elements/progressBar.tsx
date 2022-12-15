import styles from '../../styles/components/progressBar.module.scss';
import { Duration } from '@common/types/duration';

export interface ProgressBarProps {
  progress: Duration;
  duration: Duration;
}

export default function ProgressBar({ progress, duration }: ProgressBarProps) {
  const fillerWidth = {
    width: `${(progress / duration) * 100}%`,
  };

  return (
    <div className={styles.containerStyles}>
      <div className={styles.fillerStyles} style={fillerWidth}>
        <span className={styles.circle}></span>
      </div>
    </div>
  );
}
