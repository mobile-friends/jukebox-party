export function assertNeverReached(x: never): never {
  throw new Error('This should never be reached');
}
