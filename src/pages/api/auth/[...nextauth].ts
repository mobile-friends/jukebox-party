import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PartyDb } from '@common/partyDb';
import { PartyCode } from '@common/types/partyCode';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { Guid } from 'guid-typescript';
import { NextApiRequest, NextApiResponse } from 'next';

const jukeCredentialProvider = CredentialsProvider({
  id: 'Juke',
  name: 'Juke',
  credentials: {
    partyCode: { label: 'Party-code', type: 'text' },
    userId: { label: 'User-id', type: 'text' },
  },
  async authorize(credentials, req) {
    if (credentials === undefined) return null;
    const partyCode = PartyCode.tryMake(credentials.partyCode);
    if (partyCode === null) return null;

    const userId = Guid.isGuid(credentials.userId) ? credentials.userId : null;
    if (userId === null) return null;

    const party = await PartyDb.tryGetByCode(firebaseDb, partyCode);
    if (PartyDb.isError(party)) return null;

    if (!Party.hasUserWithId(party, userId)) return null;
    return { partyCode, id: userId.toString() };
  },
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [jukeCredentialProvider],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

export default function (req: NextApiRequest, res: NextApiResponse) {
  if(!process.env.NEXT_AUTH_SECRET)
    throw Error("NEXT_AUTH_SECRET env with any value is required!")
  return NextAuth(req, res, authOptions);
}
