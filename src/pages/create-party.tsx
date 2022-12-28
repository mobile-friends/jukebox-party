import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { useValidatePartyNameInput } from '@hook/inputs/useValidatePartyNameInput';
import { useValidatePartyUserNameInput } from '@hook/inputs/useValidatePartyUserNameInput';
import ErrorList from '../components/elements/ErrorList';
import { GetServerSideProps } from 'next/types';
import { signIn } from 'next-auth/react';
import { JukeClient } from '@common/jukeClient';
import { SpotifyToken } from '@common/types/global';

type Props = { spotifyToken: SpotifyToken | null };

function CreateParty({ spotifyToken }: Props) {
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

  function goBackToStart() {
    router.push('/').catch(console.error);
  }

  if (spotifyToken === null) {
    goBackToStart();
    return <div>No token</div>;
  }

  function onBackClicked() {
    goBackToStart();
  }

  function onPartyNameChanged(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyNameInput(e.target.value);
  }

  function onHostNameChanged(e: ChangeEvent<HTMLInputElement>) {
    validateAndSetPartyUserNameInput(e.target.value);
  }

  async function goToPartyPage(partyCode: PartyCode, userId: string) {
    const partyUrl = `/party/${encodeURIComponent(partyCode)}`;
    await signIn('Juke', {
      callbackUrl: partyUrl,
      partyCode,
      userId,
    });
  }

  async function onCreatePartyClicked() {
    if (isPartyNameValid && isPartyUserNameValid) {
      const { partyCode, hostId } = await JukeClient.createParty(
        partyName,
        partyUserName,
        spotifyToken!
      );
      await goToPartyPage(partyCode, hostId);
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

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { token: spotifyToken } = query;
  if (typeof spotifyToken === 'string')
    return { props: { spotifyToken: spotifyToken as SpotifyToken } };
  else return { props: { spotifyToken: null } };
};

export default CreateParty;
