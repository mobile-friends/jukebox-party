import { Duration } from '../lib/duration';

describe('Duration module', () => {
  test('Zero duration has 0 seconds', () => {
    expect(Duration.secondsIn(Duration.Zero)).toBe(0);
  });

  test('Seconds can be converted to duration and back', () => {
    const seconds = 37;
    const duration = Duration.makeFromSeconds(seconds);
    expect(Duration.secondsIn(duration)).toBe(seconds);
  });

  test('Minutes can be converted to duration and back', () => {
    const minutes = 2;
    const duration = Duration.make(minutes, 0);
    expect(Duration.minutesIn(duration)).toBe(minutes);
  });

  test('1 minute duration is equal to 60 second duration', () => {
    const minute = Duration.make(1, 0);
    const seconds = Duration.make(0, 60);
    expect(minute).toEqual(seconds);
  });
});
