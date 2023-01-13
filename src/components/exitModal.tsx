import styles from '@style/components/qrCodeModal.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { BaseSyntheticEvent } from 'react';
import Button from './elements/button';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { useSession } from 'next-auth/react';
import { PagePath } from '@common/pagePath';

type ModalCloseListener = () => void;

interface Props {
  /**
   * The code of the party to link to
   */
  partyCode: PartyCode;
  /**
   * A listener for when the modal closed
   */
  onClosed: ModalCloseListener;
  /**
   * If the user is the host
   */
  isHost: boolean;
}

/**
 * An exit modal to ask if the user/host really want to leave the party
 * @constructor
 */
export default function ExitModal({ partyCode, onClosed, isHost }: Props) {
  const { data } = useSession();
  const userId = data?.user.id;

  function handleClick(e: BaseSyntheticEvent) {
    const targetClassName: string = e.target.className;
    if (
      typeof targetClassName === 'string' &&
      targetClassName.includes('background_clickable')
    ) {
      onClosed();
    }
  }

  async function closeParty() {
    const result = await JukeClient.closeParty(partyCode, {});
    console.log(result);
    switch (result.code) {
      case StatusCodes.BAD_REQUEST:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_FOUND:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NOT_IMPLEMENTED:
        // TODO: Handle error [JUKE-142]
        break;
      case StatusCodes.NO_CONTENT: // Everything worked out
        location.assign(PagePath.partyClosed(partyCode));
        return;
      default:
        return assertNeverReached(result);
    }
  }

  async function leaveParty() {
    if (userId) {
      const result = await JukeClient.removeGuest(partyCode, {
        guestId: userId,
      });
      switch (result.code) {
        case StatusCodes.BAD_REQUEST:
          // TODO: Handle error [JUKE-142]
          break;
        case StatusCodes.NOT_FOUND:
          // TODO: Handle error [JUKE-142]
          break;
        case StatusCodes.NOT_IMPLEMENTED:
          // TODO: Handle error [JUKE-142]
          break;
        case StatusCodes.NO_CONTENT: // Everything worked out
          return;
        default:
          return assertNeverReached(result);
      }
    }
  }

  return (
    <div className={styles.background_clickable} onClick={handleClick}>
      <div className={styles.modal}>
        <h2 className='text-center'>
          {' '}
          {isHost
            ? 'Do you really want to close the party? '
            : 'Do you really want to leave?'}
        </h2>

        <div className={styles.content}>
          <p className='text-center'>
            {isHost
              ? 'If you close the party, all users will be kicked out. '
              : 'You can join again, if you change your mind!'}
          </p>
        </div>

        <div className={styles.closebar}>
          <Button
            styleType='primary block'
            content={isHost ? "No, don't close it!" : 'No, I want to stay!'}
            onClick={onClosed}
          />
        </div>

        <div className={styles.closebar}>
          <Button
            styleType='secondary block'
            content={isHost ? 'Yes, close it!' : 'Yes, I want to leave!'}
            onClick={isHost ? closeParty : leaveParty}
          />
        </div>
      </div>
    </div>
  );
}
