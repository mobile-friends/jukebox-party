import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Party } from '../../lib/party';
import { getPartyDetails } from '../../httpClient/jukebox/parties';
import useFetchParty from '../../hooks/parties/useFetchParty';

type Props = {};

interface QueryParams {
  code?: string;
}

function PartyRoom({}: Props) {
  const router = useRouter();
  const { code }: QueryParams = router.query;
  const party: Party = useFetchParty(code);

  return party !== undefined ? (
    <div>
      <h1>Party Room</h1>
      <p>Party Code: {party?.code}</p>
      <p>Party Name: {party?.name}</p>
      <p>Party Host: {party?.host.name}</p>
      <p>
        Party Guests:{' '}
        {party?.guests.map((guest) => guest.name).join(', ') ||
          'No guests have joined the party yet'}
      </p>
    </div>
  ) : null;
}

export default PartyRoom;
