import styles from '@style/components/progressBar.module.scss';
import { Duration } from '@common/types/duration';

interface Props {
  /**
   * How long the song has been playing for
   */
  progress: Duration;
  /**
   * The duration of the current track
   */
  duration: Duration;
}

/**
 * Displays the current playback progress
 * @constructor
 */
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
