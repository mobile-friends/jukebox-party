declare const tag: unique symbol;

/**
 * Represents an identifier for a party
 */
export type PartyCode = string & { readonly [tag]: 'PartyCode' };

/**
 * Contains functions for working with party-codes
 */
export namespace PartyCode {
  /**
   * Generates a new random party-code
   */
  export function generate(): PartyCode {
    const code = Math.floor(Math.random() * 1000000).toString();
    return code.padStart(6, '0') as PartyCode;
  }
}
