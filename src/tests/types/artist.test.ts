import { Artist } from '@common/types/artist';

test('Created artists have the given name', () => {
  const name = 'Mr. music';
  const id = 'asdf7890';
  const artist = Artist.make(name, id, []);
  expect(Artist.nameOf(artist)).toBe(name);
  expect(Artist.idOf(artist)).toBe(id);
});
