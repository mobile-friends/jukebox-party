import { PartyCode } from '@common/types/partyCode';
import useLivePartyUsers from '@hook/useLivePartyUsers';
import { User } from '@common/types/user';
import React from 'react';

interface Props {
  /**
   * The parties code
   */
  partyCode: PartyCode;
}

export function nameListFor(users: User[]): string {
  return users.map(User.nameOf).join(', ');
}

/**
 * Displays a parties users, so the host and the guests
 * @constructor
 */
export default function PartyUserView({ partyCode }: Props) {
  const users = useLivePartyUsers(partyCode);

  if (users === null) return <></>;

  const hostName = User.nameOf(users.host);
  const hasGuests = users.guests.length > 0;
  const guestMessage = hasGuests
    ? `Guests: ${nameListFor(users.guests)}`
    : 'No guests have joined the party yet';

  return (
    <>
      <p>Party Host: {hostName}</p>
      <p>{guestMessage}</p>
    </>
  );
}
