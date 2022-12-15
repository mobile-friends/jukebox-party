import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { createParty } from '../httpClient/jukebox/parties';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '../lib/partyCode';
import { useValidatePartyNameInput } from '../hooks/inputs/useValidatePartyNameInput';
import { useValidatePartyUserNameInput } from '../hooks/inputs/useValidatePartyUserNameInput';
import ErrorText from '../components/elements/errorText';
import ErrorList from '../components/elements/ErrorList';

type Props = {};

function CreateParty({}: Props) {
  const router = useRouter();
  const {
    partyName,
    isPartyNameValid,
    partyNameErrors,
    validateAndSetPartyNameInput,
  } = useValidatePartyNameInput();
  const {
    partyUserName,
    isPartyUserNameValid,
    partyUserNameErrors,
    validateAndSetPartyUserNameInput,
  } = useValidatePartyUserNameInput();
  const { data: session } = useSession();

  useEffect(() => {
    console.log('session', session);
  }, [session, null]);

  function onBackClicked() {
    signOut({ callbackUrl: '/' }).catch(console.log);
  }

  function onPartyNameChanged(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyNameInput(e.target.value);
  }

  function onHostNameChanged(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyUserNameInput(e.target.value);
  }

  async function goToPartyPage(partyCode: PartyCode) {
    await router.push(`/party/${encodeURIComponent(partyCode)}`);
  }

  async function onCreatePartyClicked() {
    if (isPartyNameValid && isPartyUserNameValid) {
      const party = await createParty(partyName, partyUserName);
      sessionStorage.setItem('partyCode', party.code);
      await goToPartyPage(party.code);
    } else {
      validateAndSetPartyNameInput(partyName);
      validateAndSetPartyUserNameInput(partyUserName);
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          create.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <Input
            placeholder='Party Name'
            onChange={onPartyNameChanged}
            hasError={partyNameErrors.length > 0}
          />
          <ErrorList errors={partyNameErrors} />
          <Input
            placeholder='Host Name'
            onChange={onHostNameChanged}
            hasError={partyUserNameErrors.length > 0}
          />
          <ErrorList errors={partyUserNameErrors} />
          <Button
            text='Create party'
            type='primary block'
            onClick={onCreatePartyClicked}
          />
        </form>
        <Button text='Back' type='tertiary block' onClick={onBackClicked} />
      </div>
    </div>
  );
}

export default CreateParty;
