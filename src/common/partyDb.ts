import { PartyCode } from './types/partyCode';
import { Party } from './types/party';
import firebase from 'firebase/app';
import { FirebaseDatabase } from '@firebase/database-types';
import { Guest, Host } from '@common/types/user';
import { History } from './types/history';
import { SpotifyAuthData } from '@common/types/spotifyAuthData';
import moment from 'moment';

interface PartyEntry {
  code: PartyCode;
  name: string;
  spotifyAuthData: SpotifyAuthData;
  host: Host;
  guests?: Guest[];
  history: History;
  createdAt: Date;
}

function partyNotFoundError(partyCode: PartyCode): PartyDb.Error {
  return { kind: PartyDb.ErrorType.PartyNotFound, partyCode };
}

function invalidEntryError(entry: unknown): PartyDb.Error {
  return { kind: PartyDb.ErrorType.InvalidEntry, entry };
}

function tryParseEntry(entry: PartyEntry): Party | PartyDb.Error {
  try {
    return Party.make(
      entry.code,
      entry.name,
      entry.host,
      entry.guests ?? [],
      entry.history ?? History.make([]),
      entry.spotifyAuthData,
      entry.createdAt
    );
  } catch {
    return invalidEntryError(entry);
  }
}

function documentPathFor(partyCode: PartyCode): string {
  return `parties/${partyCode}`;
}

function documentFor(
  db: FirebaseDatabase,
  partyCode: PartyCode
): firebase.database.Reference {
  const path = documentPathFor(partyCode);
  return db.ref(path);
}

/**
 * Contains functions for interacting with parties in the database
 */
export namespace PartyDb {
  export enum ErrorType {
    PartyNotFound,
    InvalidEntry,
  }

  /**
   * Error for when a party with a specific code was not found
   */
  export interface PartyNotFoundError {
    readonly kind: ErrorType.PartyNotFound;
    readonly partyCode: PartyCode;
  }

  /**
   * Error for the parties entry in the db was malformed
   */
  export interface InvalidEntryError {
    readonly kind: ErrorType.InvalidEntry;
    readonly entry: unknown;
  }

  /**
   * An error that occurs while interacting with the db
   */
  export type Error = PartyNotFoundError | InvalidEntryError;

  /**
   * Checks if an object is a PartyDb.Error
   * @param result The object
   */
  export function isError<T>(
    result: T | PartyDb.Error
  ): result is PartyDb.Error {
    return result instanceof Object && 'kind' in result;
  }

  /**
   * Attempts to load a party form the database.
   * Returns null if something went wrong
   * @param db The database
   * @param partyCode The code of the party to search
   */
  export function tryGetByCode(
    db: FirebaseDatabase,
    partyCode: PartyCode
  ): Promise<Party | PartyDb.Error> {
    const doc = documentFor(db, partyCode);
    return doc.once('value').then((snapshot) => {
      if (!snapshot.exists()) return partyNotFoundError(partyCode);
      const entry = snapshot.val() as PartyEntry;
      return tryParseEntry(entry);
    });
  }

  /**
   * Stores a party in the database
   * @param db The database
   * @param party The party
   */
  export async function store(
    db: FirebaseDatabase,
    party: Party
  ): Promise<void> {
    const doc = documentFor(db, party.code);
    await doc.set({ ...party, createdAt: party.createdAt.valueOf() });
  }

  /**
   * Deletes all parties from the database that are older than three days
   * @param db The database
   */
  export async function clear(db: FirebaseDatabase): Promise<void> {
    const doc = db.ref('parties');
    await doc.get().then((snapshot) => {
      snapshot.forEach((party) => {
        const partyDbKey = party.key!;
        const currentParty = party.val() as PartyEntry;
        const createdAt = moment(currentParty.createdAt);
        if (createdAt.isBefore(moment().subtract(3, 'days'))) {
          console.log(`Deleting party ${currentParty.code}`);
          doc
            .child(partyDbKey)
            .remove()
            .then(() => {
              console.log(`Deleted party ${currentParty.code}`);
            });
        } else {
          console.log(`Not deleting party ${currentParty.code}`);
        }
      });
    });
  }
}
