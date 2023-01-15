/**
 Data for spotify-authentication
 */
export interface SpotifyAuthData {
  readonly accessToken: SpotifyToken;
  readonly refreshToken: SpotifyRefreshToken;
  readonly expirationDateMillis: number;
}

const ExpirationSeconds = 30 * 60; // 30 minutes

function dateInFuture(seconds: number): Date {
  const now = new Date();
  return new Date(now.getTime() + seconds * 1000);
}

function expirationDateFromNow(): Date {
  return dateInFuture(ExpirationSeconds);
}

/**
 * Functions for working with spotify auth-data
 */
export namespace SpotifyAuthData {
  /**
   * Make a new instance of data
   * @param accessToken The spotify access-token
   * @param refreshToken The spotify refresh-token
   * @param expirationDate The date when this data expires
   */
  export function make(
    accessToken: SpotifyToken,
    refreshToken: SpotifyRefreshToken,
    expirationDate: Date
  ): SpotifyAuthData {
    return Object.freeze({
      accessToken,
      refreshToken,
      expirationDateMillis: expirationDate.getTime(),
    });
  }

  /**
   * Makes a new spotify auth-data set
   * @param accessToken The spotify access-token
   * @param refreshToken The spotify refresh-token
   */
  export function makeNew(
    accessToken: SpotifyToken,
    refreshToken: SpotifyRefreshToken
  ): SpotifyAuthData {
    return make(accessToken, refreshToken, expirationDateFromNow());
  }
}
