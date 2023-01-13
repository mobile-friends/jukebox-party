import styles from '@style/components/partyUserView.module.scss';
import { PartyCode } from '@common/types/partyCode';
import useLivePartyUsers from '@hook/useLivePartyUsers';
import { Guest, User } from '@common/types/user';
import React from 'react';
import Button from '@component/elements/button';

type GuestRemoveListener = (guest: Guest) => SyncOrAsync<void>;

interface Props {
  /**
   * The parties code
   */
  partyCode: PartyCode;
  /**
   * Whether the current user is the host of the party
   */
  isHost: boolean;
  /**
   * Listener for when a "remove guest" button is clicked
   */
  onGuestRemove: GuestRemoveListener;
}

/**
 * Displays a parties users, so the host and the guests
 * @constructor
 */
export default function PartyUserView({
  partyCode,
  isHost,
  onGuestRemove,
}: Props) {
  function makeRemoveButtonFor(guest: Guest) {
    return (
      <Button
        styleType={'tertiary small'}
        content={'Remove'}
        onClick={async () => await onGuestRemove(guest)}
      />
    );
  }

  function makeGuestView(guest: Guest) {
    return (
      <tr key={User.idOf(guest)}>
        <td>{User.nameOf(guest)} </td>
        <td>{isHost && makeRemoveButtonFor(guest)}</td>
      </tr>
    );
  }

  const users = useLivePartyUsers(partyCode);

  if (users === null) return <div></div>;

  const hostName = User.nameOf(users.host);
  const hasGuests = users.guests.length > 0;

  return (
    <div className={`text-center ${styles.container}`}>
      <h3>
        party.<span className='text-italic text-primary'>host</span>: {hostName}
      </h3>

      <div>
        <h3>
          party.<span className='text-italic text-primary'>guests</span>
        </h3>
        <div className={styles.guestContainer}>
          {hasGuests ? (
            <>
              <table>
                <tbody>{users.guests.map(makeGuestView)}</tbody>
              </table>
            </>
          ) : (
            <p>No guests have joined the party yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
