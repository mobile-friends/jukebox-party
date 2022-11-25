import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Party } from '../../lib/party';
import {
  getPartyDetails,
  getPartyString,
} from '../../httpClient/jukebox/parties';
import database from '../../firebase.config';

const useFetchParty = (code: string): Party | null | undefined => {
  const [party, setParty] = useState<Party | null | undefined>(undefined);

  useEffect(() => {
    const fetchParty = async () => {
      if (code) {
        try {
          const party = getPartyString(code);

          database.ref(party).on('value', (snapshot) => {
            const dto: Party = snapshot.val();
            try {
              const party: Party = Party.make(
                dto.code,
                dto.name,
                dto.host,
                dto.guests ?? []
              );
              setParty(party);
            } catch (error) {
              setParty(null);
            }
          });
        } catch (e) {
          setParty(null);
        }
      }
    };
    fetchParty();
  }, [code]);

  return party;
};

export default useFetchParty;
