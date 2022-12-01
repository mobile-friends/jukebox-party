import { useState, useEffect } from 'react';
import { Party } from '../../lib/party';
import database from '../../firebase.config';
import { PartyCode } from '../../lib/partyCode';
import { PartyDb } from '../../lib/partyDb';

const useFetchParty = (partyCode: PartyCode): Party | null => {
  const [party, setParty] = useState<Party | null>(null);

  useEffect(() => {
    PartyDb.tryGetByCode(database, partyCode)
      .then(setParty)
      .catch(() => setParty(null));
  }, [partyCode]);

  return party;
};

export default useFetchParty;
