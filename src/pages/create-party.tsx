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
import JukeHeader from '@component/elements/jukeHeader';
import { SpotifyUser } from '@common/types/user';
import { SpotifyClient } from '@common/spotifyClient';

interface SpotifyProps {
  spotifyToken: SpotifyToken | null;
  spotifyUser: SpotifyUser | null;
}

type Props = SpotifyProps;

export default function CreateParty({ spotifyToken, spotifyUser }: Props) {
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

  function goToLogin() {
    router.push({
      pathname: '/spotify-login',
      query: { newLogin: 'true' },
    });
  }

  async function onCreatePartyClicked() {
    if (partyName !== null && hostName !== null && spotifyToken) {
      await tryCreateParty(partyName, hostName, spotifyToken);
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <JukeHeader
          first={'create'}
          second={'party'}
          pageTitle={'Create a jukebox.party'}
        />

        <div>
          {spotifyUser === null ? (
            <></>
          ) : (
            <div className={styles.greeting}>
              <h2 className='text-center'>
                Hi <span className='text-italic'>{spotifyUser.nickname}</span>!
              </h2>
              <p className='text-muted text-center'>
                Account from {spotifyUser.email}
              </p>
            </div>
          )}
          <form>
            <PartyNameInput initialValue={null} onValueChanged={setPartyName} />
            <UserNameInput initialValue={null} onValueChanged={setHostName} />
            <Button
              content='Create party'
              styleType='primary block'
              onClick={onCreatePartyClicked}
            />
          </form>
          <div className={styles.anotherAccount}>
            <p className='text-muted text-center'>
              Not you? Log out and use another account
            </p>
            <Button
              content='Use another account'
              styleType='secondary block'
              onClick={goToLogin}
            />
          </div>
        </div>

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
  if (typeof spotifyToken === 'string') {
    const spotifyUser: SpotifyUser = await SpotifyClient.getSpotifyUserInfo(
      spotifyToken as SpotifyToken
    );
    return {
      props: { spotifyToken: spotifyToken as SpotifyToken, spotifyUser },
    };
  } else return { props: { spotifyToken: null, spotifyUser: null } };
};
