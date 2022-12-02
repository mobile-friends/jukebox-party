import { useEffect, useState } from 'react';
import { Party } from '../../lib/party';
import database from '../../firebase.config';
import { PartyCode } from '../../lib/partyCode';
import { PartyDb } from '../../lib/partyDb';

function useFetchParty(partyCode: PartyCode): Party | null | PartyDb.Error {
  const [result, setResult] = useState<Party | null | PartyDb.Error>(null);

  useEffect(() => {
    PartyDb.tryGetByCode(database, partyCode)
      .then(setResult)
      .catch(() => setResult(null));
  }, [partyCode]);

  return result;
}

export default useFetchParty;
