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
      <li key={User.idOf(guest)}>
        {User.nameOf(guest)} {isHost && makeRemoveButtonFor(guest)}
      </li>
    );
  }

  const users = useLivePartyUsers(partyCode);

  if (users === null) return <></>;

  const hostName = User.nameOf(users.host);
  const hasGuests = users.guests.length > 0;

  return (
    <>
      <p>Party Host: {hostName}</p>
      {hasGuests ? (
        <>
          <p>Guests</p>
          <ul>{users.guests.map(makeGuestView)}</ul>
        </>
      ) : (
        <p>No guests have joined the party yet</p>
      )}
    </>
  );
}
