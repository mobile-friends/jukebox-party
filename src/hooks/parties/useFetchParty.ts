import { useEffect, useState } from 'react';
import { Party } from '@src/lib/party';
import database from '../../../firebase.config';
import { PartyCode } from '@src/lib/partyCode';
import { PartyDb } from '@src/lib/partyDb';

function useFetchParty(partyCode: PartyCode): Party | null | PartyDb.Error {
  const [result, setResult] = useState<Party | null | PartyDb.Error>(null);

  useEffect(
    () => PartyDb.subscribeToPartyByCode(database, partyCode, setResult),
    [partyCode]
  );

  return result;
}

export default useFetchParty;
