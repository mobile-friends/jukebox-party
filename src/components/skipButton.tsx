import { GiNextButton, GiPreviousButton } from 'react-icons/gi';
import Button from './elements/button';
import { JukeClient } from '@common/jukeClient';
import { SkipDirection } from '@common/types/constants';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  /**
   * The direction to skip into
   */
  skipDirection: SkipDirection;
  partyCode: PartyCode;
}

/**
 * A button for skipping forwards or backwards in playback
 * @constructor
 */
export default function SkipButton({ skipDirection, partyCode }: Props) {

  async function skip() {
    await JukeClient.skip(partyCode, skipDirection);
  }

  const isForwardSkip = skipDirection === SkipDirection.Forward;
  const margin = isForwardSkip ? { marginRight: '3em' } : { marginLeft: '3em' };
  const icon = isForwardSkip ? <GiNextButton /> : <GiPreviousButton />;

  return (
    <div style={margin}>
      <style jsx>{`
        div {
          margin: auto 0; // TODO: Extract style to scss file
        }
      `}</style>
      <Button styleType='icon-only small' content={icon} onClick={skip} />
    </div>
  );
}
