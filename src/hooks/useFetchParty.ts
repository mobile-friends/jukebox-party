import { useEffect, useState } from 'react';
import { Party } from '@common/types/party';
import { PartyCode } from '@common/types/partyCode';
import { PartyDb } from '@common/partyDb';
import { FirebaseDatabase } from '@firebase/database-types';

function useFetchParty(
  db: FirebaseDatabase,
  partyCode: PartyCode
): Party | null | PartyDb.Error {
  const [result, setResult] = useState<Party | null | PartyDb.Error>(null);

  useEffect(
    () => PartyDb.subscribeToPartyByCode(db, partyCode, setResult),
    [partyCode]
  );

  return result;
}

export default useFetchParty;
