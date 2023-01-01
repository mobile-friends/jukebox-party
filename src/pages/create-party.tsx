import { useRouter } from 'next/router';
import Button from '../components/elements/button';
import Input from '../components/elements/input';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { useValidatePartyNameInput } from '@hook/inputs/useValidatePartyNameInput';
import { useValidatePartyUserNameInput } from '@hook/inputs/useValidatePartyUserNameInput';
import ErrorList from '@component/elements/errorList';
import { GetServerSideProps } from 'next/types';
import { signIn } from 'next-auth/react';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { useEffect } from 'react';

type Props = { spotifyToken: SpotifyToken | null };

export default function CreateParty({ spotifyToken }: Props) {
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

  useEffect(() => {
    if (spotifyToken === null) goBackToStart();
  });

  if (spotifyToken === null) {
    return <div>No token</div>;
  }

  function onBackClicked() {
    goBackToStart();
  }

  async function goToPartyPage(partyCode: PartyCode, userId: string) {
    const partyUrl = `/party/${partyCode}`;
    await signIn('Juke', {
      callbackUrl: partyUrl,
      partyCode,
      userId,
    });
  }

  async function tryCreateParty(spotifyToken: SpotifyToken) {
    const result = await JukeClient.createParty({
      partyName: partyName,
      hostName: partyUserName,
      spotifyToken,
    });
    if (result.code === StatusCodes.CREATED) {
      const { partyCode, userId: hostId } = result.content;
      await goToPartyPage(partyCode, hostId);
    }
  }

  async function onCreatePartyClicked() {
    if (isPartyNameValid && isPartyUserNameValid && spotifyToken) {
      await tryCreateParty(spotifyToken);
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
            type={'text'}
            placeholder='Party Name'
            onChange={validateAndSetPartyNameInput}
            hasError={partyNameErrors.length > 0}
          />
          <ErrorList errors={partyNameErrors} />
          <Input
            type={'text'}
            placeholder='Host Name'
            onChange={validateAndSetPartyUserNameInput}
            hasError={partyUserNameErrors.length > 0}
          />
          <ErrorList errors={partyUserNameErrors} />
          <Button
            content='Create party'
            styleType='primary block'
            onClick={onCreatePartyClicked}
          />
        </form>
        <Button
          content='Back'
          styleType='tertiary block'
          onClick={onBackClicked}
        />
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
