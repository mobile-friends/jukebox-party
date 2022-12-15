import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import { createParty } from '@common/../httpClient/jukebox/parties';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '@common/types/partyCode';
import ErrorText from '../components/elements/errorText';
import { useValidatePartyNameInput } from '../../hooks/inputs/useValidatePartyNameInput';
import { useValidatePartyHostNameInput } from '../../hooks/inputs/useValidatePartyHostNameInput';

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
      const partyCode = await createParty(partyName, partyHostName);
      sessionStorage.setItem('partyCode', partyCode);
      await goToPartyPage(partyCode);
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
