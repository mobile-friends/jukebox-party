import { throws } from 'assert';

declare const tag: unique symbol;

/**
 * Represents an identifier for a party
 */
export type PartyCode = string & { readonly [tag]: 'PartyCode' };

/**
 * Contains functions for working with party-codes
 */
export namespace PartyCode {
  const Length = 6;

  /**
   * Checks if a string is a valid party-code
   * @param s The string
   */
  export function isValidPartyCode(s: string): boolean {
    return s.length === Length && !isNaN(parseInt(s, 10));
  }

  /**
   * Attempts to convert a string into a party-code.
   * Returns null if the string is not a valid party-code
   * @param s The string
   */
  export function tryMake(s: string): PartyCode | null {
    if (isValidPartyCode(s)) return s as PartyCode;
    else return null;
  }

  /**
   * Attempts to convert a string into a party-code.
   * Throws an error if the string is not a valid party-code
   * @param s The string
   */
  export function makeOrThrow(s: string): PartyCode {
    const maybeCode = tryMake(s);
    if (maybeCode !== null) return maybeCode;
    else throw new Error(`${s} is not a valid party-code`);
  }

  /**
   * Generates a new random party-code
   */
  export function generate(): PartyCode {
    const number = Math.floor(Math.random() * 999999);
    const string = number.toString().padStart(Length, '0');
    return makeOrThrow(string);
  }
}
