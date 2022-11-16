import Link from 'next/link';
import LoginButton from '../components/loginButton';

export default function Home() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || 'nope';
  const session = false;

  return (
    <div>
      <h1>jukebox.party</h1>
      <LoginButton />
    </div>
  );
}
