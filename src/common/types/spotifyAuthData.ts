/**
 Data for spotify-authentication
 */
export interface SpotifyAuthData {
  accessToken: SpotifyToken;
  refreshToken: SpotifyRefreshToken;
}

/**
 * Functions for working with spotify auth-data
 */
export namespace SpotifyAuthData {
  /**
   * Make a new instance of data
   * @param accessToken The spotify access-token
   * @param refreshToken The spotify refresh-token
   */
  export function make(
    accessToken: SpotifyToken,
    refreshToken: SpotifyRefreshToken
  ): SpotifyAuthData {
    return { accessToken, refreshToken };
  }
}
