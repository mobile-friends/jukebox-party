import { useRouter } from 'next/router';
import Button from '../components/elements/button';
import styles from '../styles/pages/main.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { GetServerSideProps } from 'next/types';
import { signIn } from 'next-auth/react';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';
import PartyNameInput from '@component/partyNameInput';
import UserNameInput from '@component/userNameInput';

type Props = { spotifyToken: SpotifyToken | null };

export default function CreateParty({ spotifyToken }: Props) {
  const router = useRouter();
  const [partyName, setPartyName] = useState<string | null>(null);
  const [hostName, setHostName] = useState<string | null>(null);

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

  async function tryCreateParty(
    partyName: string,
    hostName: string,
    spotifyToken: SpotifyToken
  ) {
    const result = await JukeClient.createParty({
      partyName,
      hostName,
      spotifyToken,
    });
    if (result.code === StatusCodes.CREATED) {
      const { partyCode, userId: hostId } = result.content;
      await goToPartyPage(partyCode, hostId);
    }
  }

  async function onCreatePartyClicked() {
    if (partyName !== null && hostName !== null && spotifyToken) {
      await tryCreateParty(partyName, hostName, spotifyToken);
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <h1 className='text-center'>
          create.<span className='text-primary text-italic'>party</span>
        </h1>
        <form>
          <PartyNameInput initialValue={null} onValueChanged={setPartyName} />
          <UserNameInput initialValue={null} onValueChanged={setHostName} />
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
