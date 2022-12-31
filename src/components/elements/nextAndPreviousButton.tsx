import { GiNextButton, GiPreviousButton } from 'react-icons/gi';
import Button from './button';
import { JukeClient } from '@common/jukeClient';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  isNextButton: boolean;
  partyCode: PartyCode;
}

export default function nextAndPreviousButton({
  isNextButton,
  partyCode,
}: Props) {
  async function tryNextTrackRequest() {
    await JukeClient.skip(partyCode, SkipDirection.Forward);
  }

  async function tryPreviousTrackRequest() {
    await JukeClient.skip(partyCode, SkipDirection.Backward);
  }

  return (
    <div style={isNextButton ? { marginRight: '3em' } : { marginLeft: '3em' }}>
      <style jsx>{`
        div {
          margin: auto 0;
        }
      `}</style>
      <Button
        styleType='icon-only small'
        content={isNextButton ? <GiNextButton /> : <GiPreviousButton />}
        onClick={isNextButton ? tryNextTrackRequest : tryPreviousTrackRequest}
      />
    </div>
  );
}
