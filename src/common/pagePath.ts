import { PartyCode } from '@common/types/partyCode';
import * as querystring from 'querystring';

/**
 * Contains paths and functions to make paths for pages in the app
 */
export namespace PagePath {
  /**
   * The path of the home-page
   */
  export const Home = '/';

  /**
   * The path of the spotify login-page
   * @param newLogin Whether to force a logout before new login
   */
  export function spotifyLogin(newLogin: boolean) {
    return `/spotify-login?${querystring.encode({ newLogin })}`;
  }

  /**
   * Makes the path of a party home-page
   * @param partyCode The code of the party
   */
  export function partyHome(partyCode: PartyCode) {
    return `/party/${partyCode}`;
  }

  /**
   * The path of the party-not-found-page
   */
  export const PartyNotFound = '/party/404';

  /**
   * Makes the path to the create-party-page
   * @param spotifyToken The spotify-token for the party
   */
  export function createParty(spotifyToken: SpotifyToken) {
    return `/create-party?${querystring.stringify({
      token: spotifyToken,
    })}`;
  }

  /**
   * Makes the path of a party queue-page
   * @param partyCode The code of the party
   */
  export function partyQueue(partyCode: PartyCode) {
    return `/party/${partyCode}/queue`;
  }

  /**
   * Makes the path of a party history-page
   * @param partyCode The code of the party
   */
  export function partyHistory(partyCode: PartyCode) {
    return `/party/${partyCode}/history`;
  }

  /**
   * Makes the path of a party lyrics-page
   * @param partyCode The code of the party
   */
  export function partyLyrics(partyCode: PartyCode) {
    return `/party/${partyCode}/lyrics`;
  }

  /**
   * Makes the path of a party add-page
   * @param partyCode The code of the party
   */
  export function partyAdd(partyCode: PartyCode) {
    return `/party/${partyCode}/add`;
  }

  /**
   * Makes the path of a party closed-page
   * @param partyCode The code of the party
   */
  export function partyClosed(partyCode: PartyCode) {
    return `/party/${partyCode}/closed`;
  }

}
