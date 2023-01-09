import { useEffect, useState } from 'react';
import { PartyCode } from '@common/types/partyCode';
import { Guest, Host } from '@common/types/user';
import { JukeClient } from '@common/jukeClient';
import { StatusCodes } from 'http-status-codes';

export interface PartyUsers {
  host: Host;
  guests: Guest[];
}

export default function useLivePartyUsers(
  partyCode: PartyCode,
  updateFrequency = 1000
): PartyUsers | null {
  const [users, setUsers] = useState<PartyUsers | null>(null);

  useEffect(() => {
    async function refreshParty() {
      const result = await JukeClient.getPartyUsers(partyCode);
      // TODO: Handle errors better [JUKE-142]
      if (result.code !== StatusCodes.OK) return setUsers(null);
      setUsers(result.content);
    }

    const interval = setInterval(refreshParty, updateFrequency);
    return () => clearInterval(interval);
  }, [partyCode, updateFrequency]);

  return users;
}
