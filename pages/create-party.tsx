import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { createParty } from '../httpClient/jukebox/parties';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '../lib/partyCode';
import { useValidatePartyNameInput } from '../hooks/inputs/useValidatePartyNameInput';
import { useValidatePartyHostNameInput } from '../hooks/inputs/useValidatePartyHostNameInput';
import ErrorText from '../components/elements/errorText';

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
    partyHostName,
    isPartyHostNameValid,
    partyHostNameErrors,
    validateAndSetPartyHostNameInput,
  } = useValidatePartyHostNameInput();
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
    validateAndSetPartyHostNameInput(e.target.value);
  }

  async function goToPartyPage(partyCode: PartyCode) {
    await router.push(`/party/${encodeURIComponent(partyCode)}`);
  }

  async function onCreatePartyClicked() {
    if (isPartyNameValid && isPartyHostNameValid) {
      const party = await createParty(partyName, partyHostName);
      sessionStorage.setItem('partyCode', party.code);
      await goToPartyPage(party.code);
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          create.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <Input placeholder='Party Name' onChange={onPartyNameChanged} />
          {partyNameErrors.map((error, index) => (
            <ErrorText errorText={error} key={index} />
          ))}
          <Input placeholder='Host Name' onChange={onHostNameChanged} />
          {partyHostNameErrors.map((error, index) => (
            <ErrorText errorText={error} key={index} />
          ))}
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
