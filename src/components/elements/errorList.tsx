import React from 'react';
import styles from '../../styles/components/errorList.module.scss';

/**
 * Props for the error-list
 */
interface Props {
  /**
   * The messages to display
   */
  errors: ErrorMessage[];
}

/**
 * Renders out a list of error-messages
 * @constructor
 */
export default function ErrorList({ errors }: Props) {
  // For now we just join the errors together and render them in one line
  // TODO: Maybe replace with a list?
  const text = errors.join(', ');
  return (
    <div className={styles.errorContainer}>
      <span className='text-error'>{text}</span>
    </div>
  );
}
