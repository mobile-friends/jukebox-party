import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Party } from '../../lib/party';
import { getPartyDetails } from '../../httpClient/jukebox/parties';

type Props = {};

interface QueryParams {
  code?: string;
}

function PartyRoom({}: Props) {
  const [party, setParty] = React.useState<Party>();
  const router = useRouter();
  const { code }: QueryParams = router.query;

  useEffect(() => {
    const fetchParty = async () => {
      if (code) {
        const party: Party = await getPartyDetails(code);
        console.log(party);
        setParty(party);
      }
    };
    fetchParty();
  }, [code]);

  return (
    <div>
      <h1>Party Room</h1>
      <p>Party Code: {party?.code}</p>
      <p>Party Name: {party?.name}</p>
      <p>Party Host: {party?.host.name}</p>
      <p>Party Guests: {party?.guests.map((guest) => guest.name)}</p>
    </div>
  );
}

export default PartyRoom;
