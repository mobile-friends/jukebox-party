import { useRouter } from 'next/router';
import Button from '../components/elements/button';
import ErrorList from '@component/elements/errorList';
import Input from '../components/elements/input';
import styles from '../styles/pages/main.module.scss';
import { useValidatePartyUserNameInput } from '@hook/inputs/useValidatePartyUserNameInput';
import { PartyCode } from '@common/types/partyCode';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { signIn } from 'next-auth/react';
import PartyCodeInput from '@component/partyCodeInput';
import { useState } from 'react';
import { tryQueryParam } from '@common/util/query';

export default function Home() {
  const router = useRouter();
  const partyCodeParam = tryQueryParam(router.query, 'partyCode');
  const [partyCode, setPartyCode] = useState<PartyCode | null>(null);
  const {
    partyUserName,
    isPartyUserNameValid,
    partyUserNameErrors,
    validateAndSetPartyUserNameInput,
  } = useValidatePartyUserNameInput();

  function goToLogin() {
    router.push('/spotify-login').catch(console.error);
  }

  async function goTo404() {
    await router.push(`/party/404`);
  }

  async function joinParty(partyCode: PartyCode) {
    const result = await JukeClient.joinParty({
      partyCode,
      guestName: partyUserName,
    });
    switch (result.code) {
      case StatusCodes.OK:
        return await signIn('Juke', {
          callbackUrl: `/party/${partyCode}`,
          partyCode,
          userId: result.content.userId,
        });
      case StatusCodes.NOT_FOUND:
        return await goTo404();
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error
        return;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error
        return;
      default:
        return assertNeverReached(result);
    }
  }

  function onJoinPartyClicked() {
    if (!isPartyUserNameValid)
      return validateAndSetPartyUserNameInput(partyUserName);
    if (!partyCode) return;

    joinParty(partyCode).catch(console.error);
  }

  function onCreatePartyClicked() {
    goToLogin();
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          jukebox.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <Input
            type='text'
            placeholder='Name'
            onChange={validateAndSetPartyUserNameInput}
            hasError={partyUserNameErrors.length > 0}
          />
          <ErrorList errors={partyUserNameErrors} />
          <PartyCodeInput
            initialValue={partyCodeParam}
            onValueChanged={setPartyCode}
          />
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
    </div>
  );
}
