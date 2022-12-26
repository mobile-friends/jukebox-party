import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PartyDb } from '@common/partyDb';
import { PartyCode } from '@common/types/partyCode';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { Guid } from 'guid-typescript';

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

const jukeCredentialProvider = CredentialsProvider({
  id: "Juke",
  name: 'Juke',
  credentials: {
    partyCode: { label: 'Party-code', type: 'text' },
    userId: { label: 'User-id', type: 'text' },
  },
  async authorize(credentials, req) {
    if (credentials === undefined) return null;

    const partyCode = PartyCode.tryMake(credentials.partyCode);
    if (partyCode === null) return null;

    const userId = Guid.isGuid(credentials.userId)
      ? Guid.parse(credentials.userId)
      : null;
    if (userId === null) return null;

    const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
    if (PartyDb.isError(party)) return null;

    if (!Party.hasUserWithId(party, userId)) return null;
    return { id: userId.toString() };
  },
});

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
