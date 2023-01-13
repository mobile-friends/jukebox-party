import '../styles/global.scss';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>jukebox.party</title>
        <meta name='description' content='Jukebox party' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
