import { Party } from '../lib/party';
import { User } from '../lib/user';

const testCode = '12345';
const testName = 'The best party';
const testHost = User.makeHost('User McHost');
const testGuest = User.makeGuest("Mr. Guest")

test('A new party has no guests', () => {
  const party = Party.startNew(testCode, testName, testHost);
  const guests = Party.guestsOf(party);
  expect(guests).toHaveLength(0);
});

test("Adding a guest increases the guest-count by one", () => {
  const party = Party.startNew(testCode, testName, testHost);
  const withGuest = Party.addGuestTo(party, testGuest)
  const guests = Party.guestsOf(withGuest);
  expect(guests).toHaveLength(1)
})
