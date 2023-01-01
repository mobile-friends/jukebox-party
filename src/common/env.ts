export namespace Env {
  function get(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`${key} not in env!`);
    return value;
  }

  export function firebaseApiKey(): string {
    return get('NEXT_PUBLIC_FIREBASE_API_KEY');
  }

  export function firebaseMessagingSenderId(): string {
    return get('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  }

  export function firebaseAppId(): string {
    return get('NEXT_PUBLIC_FIREBASE_APP_ID');
  }

  export function firebaseMeasurementId(): string {
    return get('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID');
  }

  export function firebaseDatabaseUrl(): string {
    return get('NEXT_PUBLIC_FIREBASE_DATABASE_URL');
  }

  export function spotifyClientId(): string {
    return get('SPOTIFY_CLIENT_ID');
  }

  export function spotifyClientSecret(): string {
    return get('SPOTIFY_CLIENT_SECRET');
  }

  export function nextAuthSecret(): string {
    return get('NEXT_AUTH_SECRET');
  }
}
