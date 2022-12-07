const createSeeds = (results: any) => {
  let seeds = {
    artists: createArtistSeeds(results),
    tracks: createTrackSeeds(results),
  };

  return seeds;
};

//TODO: Refactor
const createArtistSeeds = (result: any) => {
  const artists: string[] = [];
  result.items.forEach((item: { track: { artists: any[] } }) => {
    item.track.artists.forEach((item) => {
      artists.push(item.id);
    });
  });
  return artists.toString();
};

//TODO: Refactor
const createTrackSeeds = (result: any) => {
  const tracks: string[] = [];
  result.items.forEach((item: { track: { id: string } }) => {
    tracks.push(item.track.id);
  });
  return tracks.toString();
};

export { createSeeds };
