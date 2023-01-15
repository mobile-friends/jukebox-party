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
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🎉</text></svg>'
        ></link>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
