import { Guest, Host } from './user';

declare const tag: unique symbol;

/**
 * A party
 */
export interface Party {
  readonly code: string;
  readonly name: string;
  readonly host: Host;
  readonly guests: Guest[];
  readonly [tag]: 'Party';
}

/**
 * Contains functions for working with parties
 */
export namespace Party {
  /**
   * Constructor function for parties
   * @param code The parties code
   * @param name The parties name
   * @param host The parties host
   * @param guests The parties guests
   */
  export function make(
    code: string,
    name: string,
    host: Host,
    guests: Guest[]
  ): Party {
    return Object.freeze({ code, name, host, guests } as Party);
  }

  /**
   * Starts a new party
   * @param code The parties code
   * @param name The parties name
   * @param host The parties host-user
   */
  export function startNew(code: string, name: string, host: Host) {
    return make(code, name, host, []);
  }

  /**
   * Adds a guest to the party and returns the updated party
   * @param party The party
   * @param guest The guest
   */
  export function addGuestTo(party: Party, guest: Guest): Party {
    let newGuests = [...party.guests, guest];
    return make(party.code, party.name, party.host, newGuests);
  }
}
