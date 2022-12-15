import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { ChangeEvent, useState } from 'react';
import Button from '../components/elements/button';
import ErrorList from '../components/elements/ErrorList';
import ErrorText from '../components/elements/errorText';
import Input from '../components/elements/input';
import QRCodeModal from '../components/elements/qrCodeModal';
import { useValidatePartyCodeInput } from '../hooks/inputs/useValidatePartyCode';
import { useValidatePartyUserNameInput } from '../hooks/inputs/useValidatePartyUserNameInput';
import { sendJoinPartyRequest } from '../httpClient/jukebox/parties';
import styles from '../styles/pages/main.module.scss';

interface Props {
  provider: ClientSafeProvider;
}

export default function Home({ provider }: Props) {
  const router = useRouter();
  const {
    partyUserName,
    isPartyUserNameValid,
    partyUserNameErrors,
    validateAndSetPartyUserNameInput,
  } = useValidatePartyUserNameInput();
  const {
    partyCode,
    isPartyCodeValid,
    partyCodeErrors,
    validateAndSetPartyCodeInput,
  } = useValidatePartyCodeInput(
    router.query.partyCode ? router.query.partyCode.toString() : undefined
  );

  function goToLogin() {
    signIn(provider.id, { callbackUrl: '/create-party' }).catch(console.log);
  }

  async function goToPartyPage() {
    await router.push(`/party/${partyCode}`);
  }

  async function goTo404() {
    await router.push(`/party/404`);
  }

  async function joinParty() {
    const success = await sendJoinPartyRequest(partyCode, partyUserName);
    if (success) {
      sessionStorage.setItem('partyCode', partyCode);
      await goToPartyPage();
    } else await goTo404();
  }

  function onUsernameInput(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyUserNameInput(e.target.value);
  }

  function onPartyCodeInput(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyCodeInput(e.target.value);
  }

  function onJoinPartyClicked() {
    if (isPartyUserNameValid && isPartyCodeValid) {
      joinParty().catch(console.log);
    } else {
      validateAndSetPartyCodeInput(partyCode);
      validateAndSetPartyUserNameInput(partyUserName);
    }
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
            placeholder='Name'
            onChange={onUsernameInput}
            hasError={partyUserNameErrors.length > 0}
          />
          <ErrorList errors={partyUserNameErrors} />
          <Input
            type='number'
            placeholder='Party code'
            value={partyCode}
            onChange={onPartyCodeInput}
            hasError={partyCodeErrors.length > 0}
          />
          <ErrorList errors={partyCodeErrors} />
          <Button
            text='Join party'
            type='primary block'
            onClick={onJoinPartyClicked}
          />
        </form>
        <Button
          text='Create party'
          type='tertiary block'
          onClick={onCreatePartyClicked}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const providers = await getProviders();
  if (providers === null) throw new Error('Could not get spotify providers');
  return { props: { provider: providers.spotify } };
};
