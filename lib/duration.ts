export type Duration = number;

export namespace Duration {
  const SecondsInMinute = 60;

  export function makeFromSeconds(seconds: number): Duration {
    return Math.ceil(seconds);
  }

  export function make(minutes: number, seconds: number): Duration {
    return makeFromSeconds(minutes * SecondsInMinute + seconds);
  }

  export function secondsIn(duration: Duration): number {
    return duration;
  }

  export function minutesIn(duration: Duration): number {
    return Math.floor(duration / SecondsInMinute);
  }

  export function formatted(duration: Duration): string {
    const minutes = minutesIn(duration);
    const extraSeconds = secondsIn(duration) % SecondsInMinute;
    return `${minutes}:${extraSeconds}`;
  }
}
