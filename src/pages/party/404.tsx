import router from 'next/router';
import React from 'react';
import Button from '../../common/components/elements/button';
import styles from '../../styles/pages/404.module.scss';

type Props = {};

function PartyNotFound({}: Props) {
  async function goToJoinPage() {
    await router.push('/');
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          not-found.<span className='text-primary text-italic'>party</span>
        </h1>
        <div className={styles.backLink}>
          <h2 className='text-light text-center'>
            Your party code is not valid.
          </h2>
          <div className={styles.btnWidth}>
            <Button
              text='Join another party'
              type='primary'
              onClick={goToJoinPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartyNotFound;
