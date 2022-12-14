import * as fc from 'fast-check';
import { User } from '@common/types/user';

export const arbUsername = fc.constantFrom(
  'Ramon',
  'Michelle',
  'Fabian',
  'Eva',
  'Lukas',
  'Lisa',
  'Alexander'
);

export const arbHost = arbUsername.map((name) => User.makeHost(name));

export const arbGuest = arbUsername.map((name) => User.makeGuest(name));

export const arbUser: fc.Arbitrary<User> = fc.oneof(arbHost, arbGuest);
