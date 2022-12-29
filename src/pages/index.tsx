import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { ChangeEvent } from 'react';
import Button from '../components/elements/button';
import ErrorList from '../components/elements/ErrorList';
import Input from '../components/elements/input';
import styles from '../styles/pages/main.module.scss';
import { useValidatePartyUserNameInput } from '@hook/inputs/useValidatePartyUserNameInput';
import { useValidatePartyCodeInput } from '@hook/inputs/useValidatePartyCode';
import { tryQueryParam } from '@common/util/query';
import { PartyCode } from '@common/types/partyCode';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';

interface Props {}

export default function Home({}: Props) {
  const router = useRouter();
  const {
    partyUserName,
    isPartyUserNameValid,
    partyUserNameErrors,
    validateAndSetPartyUserNameInput,
  } = useValidatePartyUserNameInput();
  const [validatedPartyCode, setPartyCodeInput] = useValidatePartyCodeInput(
    tryQueryParam(router.query, 'partyCode') ?? ''
  );

  function goToLogin() {
    router.push('/spotify-login').catch(console.error);
  }

  async function goToPartyPage(partyCode: PartyCode) {
    await router.push(`/party/${partyCode}`);
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
        // TODO: Sign-in guest
        return await goToPartyPage(partyCode);
      case StatusCodes.NOT_FOUND:
        return await goToPartyPage(partyCode);
      case StatusCodes.BAD_REQUEST:
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle errors
        return;
      default:
        return assertNeverReached(result);
    }
  }

  function onUsernameInput(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyUserNameInput(e.target.value);
  }

  function onPartyCodeInput(e: ChangeEvent<HTMLInputElement>) {
    setPartyCodeInput(e.target.value);
  }

  function onJoinPartyClicked() {
    if (!isPartyUserNameValid)
      return validateAndSetPartyUserNameInput(partyUserName);
    if (!validatedPartyCode.isValidated || !validatedPartyCode.isValid)
      return setPartyCodeInput(validatedPartyCode.input);

    joinParty(validatedPartyCode.partyCode).catch(console.error);
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
            value={validatedPartyCode.input}
            onChange={onPartyCodeInput}
            hasError={
              validatedPartyCode.isValidated && !validatedPartyCode.isValid
            }
          />
          <ErrorList
            errors={
              validatedPartyCode.isValidated && !validatedPartyCode.isValid
                ? validatedPartyCode.errors
                : []
            }
          />
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
  return { props: {} };
};
