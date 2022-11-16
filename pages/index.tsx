import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '../components/elements/button';

export default function Home() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || 'nope';
  const session = false;

  return (
    <div>
      <h1>jukebox.party</h1>

      {!session && (
        <>
          <h1>You are not signed in</h1> <br />
          <Button></Button>
          {clientId}
        </>
      )}

      {session && (
        <>
          <h1>Signed in as {session?.user?.email} </h1> <br />
          <h2>
            Go to{' '}
            <Link href='/jobs'>
              <a>Test</a>
            </Link>{' '}
          </h2>
        </>
      )}
    </div>
  );
}
