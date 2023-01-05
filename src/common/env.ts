import * as process from 'process';

function tryGet(key: string): string {
  const value = process.env[key];
  if (value === undefined) throw new Error(`${key} not in env!`);
  return value;
}

export namespace Env {
  export function firebaseApiKey(): string {
    return tryGet('NEXT_PUBLIC_FIREBASE_API_KEY');
  }

  export function firebaseMessagingSenderId(): string {
    return tryGet('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  }

  export function firebaseAppId(): string {
    return tryGet('NEXT_PUBLIC_FIREBASE_APP_ID');
  }

  export function firebaseMeasurementId(): string {
    return tryGet('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID');
  }

  export function firebaseDatabaseUrl(): string {
    return tryGet('NEXT_PUBLIC_FIREBASE_DATABASE_URL');
  }

  export function spotifyClientId(): string {
    return tryGet('SPOTIFY_CLIENT_ID');
  }

  export function spotifyClientSecret(): string {
    return tryGet('SPOTIFY_CLIENT_SECRET');
  }

  export function nextAuthSecret(): string {
    return tryGet('NEXT_AUTH_SECRET');
  }

  export function isProduction(): boolean {
    // TODO dynamisch mit ENV-Variablen machen - Funktioniert irgendwie nicht im Frontend

    return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  }
}
