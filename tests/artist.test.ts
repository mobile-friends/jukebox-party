import { Artist } from '../lib/artist';

test('Created artists have the given name', () => {
  const name = 'Mr. music';
  const artist = Artist.make(name);
  expect(Artist.nameOf(artist)).toBe(name);
});
