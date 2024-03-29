import { Party } from '@common/types/party';
import { User } from '@common/types/user';
import { SpotifyAuthData } from '@common/types/spotifyAuthData';

const testName = 'The best party';
const testHost = User.makeHost('User McHost');
const testGuest = User.makeGuest('Mr. Guest');
const testSpotifyAuthData = SpotifyAuthData.makeNew(
  '' as SpotifyToken,
  '' as SpotifyRefreshToken
);

test('A new party has no guests', () => {
  const party = Party.startNew(testName, testHost, testSpotifyAuthData);
  const guests = Party.guestsOf(party);
  expect(guests).toHaveLength(0);
});

test('Adding a guest increases the guest-count by one', () => {
  const party = Party.startNew(testName, testHost, testSpotifyAuthData);
  const withGuest = Party.addGuestTo(party, testGuest);
  const guests = Party.guestsOf(withGuest);
  expect(guests).toHaveLength(1);
});
