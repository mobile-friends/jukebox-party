import styles from '@style/components/userListModal.module.scss';
import { PartyCode } from '@common/types/partyCode';
import PartyUserView from './partyUserView';
import { StatusCodes } from 'http-status-codes';
import { assertNeverReached } from '@common/util/assertions';
import { Guest, User } from '@common/types/user';
import { JukeClient } from '@common/jukeClient';
import Button from './elements/button';
import { BaseSyntheticEvent } from 'react';

type ModalCloseListener = () => void;

interface Props {
  partyCode: PartyCode;
  isHost: boolean;
  onClosed: ModalCloseListener;
}

export default function UserListModal({ partyCode, isHost, onClosed }: Props) {
  async function removeGuest(guest: Guest) {
    const result = await JukeClient.removeGuest(partyCode, {
      guestId: User.idOf(guest),
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

  return (
    <div className={styles.background} onClick={handleClick}>
      <div className={styles.modal}>
        <h2 className='text-center'>
          The party.<span className='text-italic text-primary'>people</span>
        </h2>

        <PartyUserView
          partyCode={partyCode}
          isHost={isHost}
          onGuestRemove={removeGuest}
        />

        <div className={styles.closebar}>
          <Button styleType='secondary block' content='Close' onClick={onClosed} />
        </div>
      </div>
    </div>
  );
}
