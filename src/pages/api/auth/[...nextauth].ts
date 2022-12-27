import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PartyDb } from '@common/partyDb';
import { PartyCode } from '@common/types/partyCode';
import firebaseDb from '@common/firebaseDb';
import { Party } from '@common/types/party';
import { Guid } from 'guid-typescript';

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
  providers: [],
});
