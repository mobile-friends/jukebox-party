import { useEffect, useState } from 'react';
import { Party } from '@common/types/party';
import firebaseDb from '@common/firebaseDb';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';

function useFetchParty(partyCode: PartyCode): Party | null | PartyDb.Error {
  const [result, setResult] = useState<Party | null | PartyDb.Error>(null);

  useEffect(
    () => PartyDb.subscribeToPartyByCode(firebaseDb, partyCode, setResult),
    [partyCode]
  );

  return result;
}

export default useFetchParty;
