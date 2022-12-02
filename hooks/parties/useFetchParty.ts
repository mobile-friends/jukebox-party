import { useEffect, useState } from 'react';
import { Party } from '../../lib/party';
import database from '../../firebase.config';
import { PartyCode } from '../../lib/partyCode';
import { PartyDb } from '../../lib/partyDb';

function useFetchParty(partyCode: PartyCode): Party | null | PartyDb.Error {
  const [party, setParty] = useState<Party | null | PartyDb.Error>(null);

  useEffect(() => {
    PartyDb.tryGetByCode(database, partyCode)
      .then(setParty)
      .catch(() => setParty(null));
  }, [partyCode]);

  return party;
}

export default useFetchParty;
