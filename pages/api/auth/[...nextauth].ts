import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const Scope =
  'user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative';

function tryGetSpotifyClientId(): string {
  const id = process.env.SPOTIFY_CLIENT_ID;
  if (id !== undefined) return id;
  else throw new Error('SPOTIFY_CLIENT_ID env not defined');
}

function tryGetSpotifySecret(): string {
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (secret !== undefined) return secret;
  else throw new Error('SPOTIFY_CLIENT_SECRET env not defined');
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: tryGetSpotifyClientId(),
      clientSecret: tryGetSpotifySecret(),
      authorization: {
        params: { scope: Scope },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.id;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});
