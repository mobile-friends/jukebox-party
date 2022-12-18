import React from 'react';
import styles from '../../styles/components/errorList.module.scss';

interface ErrorListProps {
  errors: string[];
}

function ErrorList({ errors }: ErrorListProps): JSX.Element {
  return (
    <div className={styles.errorContainer}>
      <span className='text-error'>{errors.join(', ')}</span>
    </div>
  );
}

export default ErrorList;
