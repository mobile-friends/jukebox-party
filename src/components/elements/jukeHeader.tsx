import Head from 'next/head';

interface Props {
  first: string;
  second: string;
  pageTitle?: string;
  showSubtitle?: boolean;
}

export default function JukeHeader({
  first,
  second,
  pageTitle,
  showSubtitle = false,
}: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle || 'jukebox.party'}</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        ></meta>
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🎉</text></svg>'
        ></link>
      </Head>
      <h1 className='text-center'>
        {first}.<span className='text-primary text-italic'>{second}</span>
      </h1>
      {showSubtitle ? (
        <h3 className='text-center'>
          because music is always better with friends
        </h3>
      ) : (
        <></>
      )}
    </>
  );
}
