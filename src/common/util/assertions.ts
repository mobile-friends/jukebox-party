// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertNeverReached(x: never): never {
  throw new Error(
    `This should never be reached. Value was ${JSON.stringify(x)}`
  );
}
