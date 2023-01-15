import { Guest, Host, User } from './user';
import { PartyCode } from './partyCode';
import { History } from './history';
import { SpotifyAuthData } from '@common/types/spotifyAuthData';

declare const tag: unique symbol;

/**
 * A party
 */
export interface Party {
  readonly code: PartyCode;
  readonly name: string;
  readonly host: Host;
  readonly guests: Guest[];
  readonly history: History;
  readonly spotifyAuthData: SpotifyAuthData;
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
   * @param history The parties history
   * @param spotifyAuthData Spotify authentication data
   */
  export function make(
    code: string,
    name: string,
    host: Host,
    guests: Guest[],
    history: History,
    spotifyAuthData: SpotifyAuthData
  ): Party {
    return Object.freeze({
      code,
      name,
      host,
      guests,
      history,
      spotifyAuthData,
    }) as Party;
  }

  /**
   * Starts a new party
   * @param name The parties name
   * @param host The parties host-user
   * @param spotifyAuthData Spotify authentication data
   */
  export function startNew(
    name: string,
    host: Host,
    spotifyAuthData: SpotifyAuthData
  ) {
    const partyCode = PartyCode.generate();
    const emptyHistory = History.make([]);
    return make(partyCode, name, host, [], emptyHistory, spotifyAuthData);
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
   * Gets the history of a party
   * @param party The party
   */
  export function historyOf(party: Party): History {
    return party.history;
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
      party.host,
      newGuests,
      party.history,
      party.spotifyAuthData
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
      party.host,
      newGuests,
      party.history,
      party.spotifyAuthData
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
      party.host,
      party.guests,
      history,
      party.spotifyAuthData
    );
  }

  export function refreshAuthData(party: Party, newToken: SpotifyToken): Party {
    return Party.make(
      party.code,
      party.name,
      party.host,
      party.guests,
      party.history,
      SpotifyAuthData.refresh(party.spotifyAuthData, newToken)
    );
  }
}
