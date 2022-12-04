import { PartyCode } from './partyCode';
import { Party } from './party';
import firebase from 'firebase/app';
import { FirebaseDatabase } from '@firebase/database-types';

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
    readonly entry: any;
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

  function partyNotFoundError(partyCode: PartyCode): PartyDb.Error {
    return { kind: ErrorType.PartyNotFound, partyCode };
  }

  function invalidEntryError(entry: any): PartyDb.Error {
    return { kind: ErrorType.InvalidEntry, entry };
  }

  function tryParseEntry(entry: any): Party | PartyDb.Error {
    try {
      return Party.make(entry.code, entry.name, entry.host, entry.guests ?? []);
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
      const entry = snapshot.val();
      return tryParseEntry(entry);
    });
  }

  /**
   * Subscribe to changes on a party-document
   * @param db The database
   * @param partyCode The code of the party
   * @param onChange A callback function that is called when the document changed
   */
  export function subscribeToPartyByCode(
    db: FirebaseDatabase,
    partyCode: PartyCode,
    onChange: (result: Party | PartyDb.Error) => void
  ) {
    const doc = documentFor(db, partyCode);
    doc.on('value', (snapshot) => {
      if (!snapshot.exists()) onChange(partyNotFoundError(partyCode));
      const entry = snapshot.val();
      onChange(tryParseEntry(entry));
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
    await doc.set(party);
  }
}
