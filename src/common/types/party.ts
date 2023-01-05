import { Guest, Host, User } from './user';
import { PartyCode } from './partyCode';
import { History } from './history';
declare const tag: unique symbol;

/**
 * A party
 */
export interface Party {
  readonly code: PartyCode;
  readonly name: string;
  readonly spotifyToken: SpotifyToken;
  readonly host: Host;
  readonly guests: Guest[];
  readonly history: History;
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
   * @param spotifyToken The spotify-token the party uses
   * @param host The parties host
   * @param guests The parties guests
   * @param history The parties history
   */
  export function make(
    code: string,
    name: string,
    spotifyToken: SpotifyToken,
    host: Host,
    guests: Guest[],
    history: History
  ): Party {
    return Object.freeze({
      code,
      name,
      spotifyToken,
      host,
      guests,
      history,
    } as Party);
  }

  /**
   * Starts a new party
   * @param name The parties name
   * @param spotifyToken The spotify-token the party uses
   * @param host The parties host-user
   */
  export function startNew(
    name: string,
    spotifyToken: SpotifyToken,
    host: Host
  ) {
    const partyCode = PartyCode.generate();
    return make(partyCode, name, spotifyToken, host, [], History.make([]));
  }

  /**
   * Gets the host of a party
   * @param party The party
   */
  export function hostOf(party: Party): Host {
    return party.host;
  }

  /**
   * Gets the guests of a party
   * @param party The party
   */
  export function guestsOf(party: Party): Guest[] {
    return party.guests;
  }

  /**
   * Gets the party-code of a party
   * @param party The party
   */
  export function codeOf(party: Party): PartyCode {
    return party.code;
  }

  /**
   * Gets the name of a party
   * @param party The party
   */
  export function nameOf(party: Party): string {
    return party.name;
  }

  /**
   * Adds a guest to the party and returns the updated party
   * @param party The party
   * @param guest The guest
   */
  export function addGuestTo(party: Party, guest: Guest): Party {
    const newGuests = [...party.guests, guest];
    return make(
      party.code,
      party.name,
      party.spotifyToken,
      party.host,
      newGuests,
      party.history
    );
  }

  /**
   * Gets all users of a party
   * @param party The party
   */
  export function usersIn(party: Party): User[] {
    return [hostOf(party), ...guestsOf(party)];
  }

  /**
   * Checks if a party has user with the given id
   * @param party The party
   * @param id The id
   */
  export function hasUserWithId(party: Party, id: string): boolean {
    return usersIn(party).map(User.idOf).includes(id);
  }

  /**
   * Removes a guest with the given id from a party
   * @param party The party
   * @param id The id
   */
  export function removeGuest(party: Party, id: UserId): Party {
    const newGuests = guestsOf(party).filter((it) => User.idOf(it) !== id);
    return make(
      party.code,
      party.name,
      party.spotifyToken,
      party.host,
      newGuests,
      party.history
    );
  }

  /**
   * Checks if the host of a party has a specific id
   * @param party The party
   * @param id The id
   */
  export function hasHostWithId(party: Party, id: UserId): boolean {
    return User.idOf(hostOf(party)) === id;
  }

  /**
   * Saves the give history to the party
   * @param party The party
   * @param history The history
   */
  export function saveHistory(party: Party, history: History): Party {
    return make(
      party.code,
      party.name,
      party.spotifyToken,
      party.host,
      party.guests,
      history
    );
  }
}
