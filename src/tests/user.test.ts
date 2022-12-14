import * as fc from 'fast-check';
import { arbGuest, arbHost, arbUser } from './arb/user';
import { User } from '@common/user';

test('User can only be host OR guest', () => {
  fc.assert(
    fc.property(arbUser, (user) => {
      expect(User.isHost(user)).not.toBe(User.isGuest(user));
    })
  );
});

test('Guests can not be cast to hosts', () => {
  fc.assert(
    fc.property(arbGuest, (guest) => {
      expect(User.asHost(guest)).toBe(null);
    })
  );
});

test('Hosts can not be cast to guests', () => {
  fc.assert(
    fc.property(arbHost, (host) => {
      expect(User.asGuest(host)).toBe(null);
    })
  );
});
