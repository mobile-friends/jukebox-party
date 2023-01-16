import router from 'next/router';
import React from 'react';
import Button from '../../components/elements/button';
import styles from '../../styles/pages/404.module.scss';
import JukeHeader from '@component/elements/jukeHeader';
import { PagePath } from '@common/pagePath';

function PartyNotFound() {
  async function goToJoinPage() {
    await router.push(PagePath.Home);
  }

  return (
    <div>
      <div className={styles.container}>
        <JukeHeader first={'no'} second={'party'} showSubtitle={true} />
        <div className={styles.backLink}>
          <h2 className='text-light text-center'>
            This party does not exist.
          </h2>
          <div className={styles.btnWidth}>
            <Button
              content='Join another party'
              styleType='primary'
              onClick={goToJoinPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartyNotFound;
