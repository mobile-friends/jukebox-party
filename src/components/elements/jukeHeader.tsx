import Head from 'next/head';

interface Props {
  first: string;
  second: string;
  pageTitle?: string;
}

export default function JukeHeader({ first, second, pageTitle }: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle || 'jukebox.party'}</title>
      </Head>
      <h1 className='text-center'>
        {first}.<span className='text-primary text-italic'>{second}</span>
      </h1>
    </>
  );
}
