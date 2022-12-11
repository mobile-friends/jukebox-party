import { Duration } from '../../lib/duration';
import styles from '../../styles/components/progressBar.module.scss';

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
