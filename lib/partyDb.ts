import { PartyCode } from './partyCode';
import { Party } from './party';
import firebase from 'firebase/app';
import database from '../firebase.config';

/**
 * Contains functions for interacting with parties in the database
 */
export namespace PartyDb {
  function documentPathFor(partyCode: PartyCode): string {
    return `parties/${partyCode}`;
  }

  function documentFor(
    db: firebase.database.Database,
    partyCode: PartyCode
  ): firebase.database.Reference {
    const path = documentPathFor(partyCode);
    return db.ref(path);
  }

  /**
   * Attempts to load a party form the database.
   * Returns null if something went wrong
   * @param db The database
   * @param partyCode The code of the party to search
   */
  export function tryGetByCode(
    db: firebase.database.Database,
    partyCode: PartyCode
  ): Promise<Party | null> {
    const doc = documentFor(db, partyCode);
    return doc.once('value').then((snapshot) => {
      if (!snapshot.exists()) return null;
      const dto = snapshot.val();
      try {
        return Party.make(dto.code, dto.name, dto.host, dto.guests ?? []);
      } catch {
        return null;
      }
    });
  }

  /**
   * Stores a party in the database
   * @param db The database
   * @param party The party
   */
  export async function store(
    db: firebase.database.Database,
    party: Party
  ): Promise<void> {
    const doc = documentFor(db, party.code);
    await doc.set(party);
  }
}
