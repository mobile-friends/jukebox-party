import { GiNextButton, GiPreviousButton } from 'react-icons/gi';
import { useSession } from 'next-auth/react';
import Button from './button';
import { nextTrack, previousTrack } from '@httpClient/spotify/player';

export interface NextAndPreviousProps {
  next: boolean;
}

export default function nextAndPreviousButton({ next }: NextAndPreviousProps) {
  let { data: session } = useSession() as any;

  async function tryNextTrackRequest() {
    try {
      await nextTrack(session?.user.accessToken);
    } catch (e) {
      console.log(e);
    }
  }

  async function tryPreviousTrackRequest() {
    try {
      await previousTrack(session?.user.accessToken);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div style={next ? { marginRight: '3em' } : { marginLeft: '3em' }}>
      <style jsx>{`
        div {
          margin: auto 0;
        }
      `}</style>
      <Button
        type='icon-only small'
        icon={next ? <GiNextButton /> : <GiPreviousButton />}
        onClick={next ? tryNextTrackRequest : tryPreviousTrackRequest}
      />
    </div>
  );
}
