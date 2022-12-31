import styles from '../../styles/components/progressBar.module.scss';
import { Duration } from '@common/types/duration';

interface Props {
  progress: Duration;
  duration: Duration;
}

export default function ProgressBar({ progress, duration }: Props) {
  const playPercent = (progress / duration) * 100;
  const fillerWidth = { width: `${playPercent}%` };

  return (
    <div className={styles.containerStyles}>
      <div className={styles.fillerStyles} style={fillerWidth}>
        <span className={styles.circle}></span>
      </div>
    </div>
  );
}
