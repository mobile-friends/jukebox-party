import { useRouter } from 'next/router';
import Button from '../components/elements/button';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { signIn } from 'next-auth/react';
import PartyCodeInput from '@component/partyCodeInput';
import { useState } from 'react';
import UserNameInput from '@component/userNameInput';
import JukeHeader from '@component/elements/jukeHeader';
import useQueryParam, { routerNotReady } from '@hook/useQueryParam';
import { PagePath } from '@common/pagePath';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();
  const partyCodeParam = useQueryParam('partyCode');
  const [partyCode, setPartyCode] = useState<PartyCode | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);

  function goToLogin() {
    router.push(PagePath.spotifyLogin(false)).catch(console.error);
  }

  async function goTo404() {
    await router.push(PagePath.PartyNotFound);
  }

  async function joinParty(partyCode: PartyCode, guestName: string) {
    const result = await JukeClient.joinParty({
      partyCode,
      guestName,
    });
    switch (result.code) {
      case StatusCodes.OK:
        return await signIn('Juke', {
          callbackUrl: PagePath.partyHome(partyCode),
          partyCode,
          userId: result.content.userId,
        });
      case StatusCodes.NOT_FOUND:
        return await goTo404();
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error [JUKE-142]
        return;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error [JUKE-142]
        return;
      default:
        return assertNeverReached(result);
    }
  }

  function onJoinPartyClicked() {
    if (partyCode !== null && guestName !== null)
      joinParty(partyCode, guestName).catch(console.error);
  }

  function onCreatePartyClicked() {
    goToLogin();
  }

  return (
    <div className={styles.container}>
      <JukeHeader
        first={'Jukebox'}
        second={'party🎉'}
        pageTitle={'Join a jukebox.party'}
        showSubtitle={true}
      />
      <form className={styles.form}>
        <UserNameInput initialValue={null} onValueChanged={setGuestName} />
        {partyCodeParam !== routerNotReady && (
          <PartyCodeInput
            initialValue={partyCodeParam}
            onValueChanged={setPartyCode}
          />
        )}
        <Button
          content='Join party'
          styleType='primary block'
          onClick={onJoinPartyClicked}
        />
      </form>
      <Button
        content='Create party'
        styleType='tertiary block'
        onClick={onCreatePartyClicked}
      />
    </div>
  );
}
