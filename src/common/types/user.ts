import { Guid } from 'guid-typescript';

declare const tag: unique symbol;

/**
 * The different roles a user can have
 */
enum UserRole {
  /**
   * A host user
   */
  Host,
  /**
   * A guest user
   */ Guest,
}

/**
 * A user that joined a party
 */
export interface Guest {
  readonly name: string;
  readonly id: string;
  readonly role: UserRole.Guest;
  readonly [tag]: 'Guest';
}

/**
 * A user that created a party
 */
export interface Host {
  readonly name: string;
  readonly id: string;
  readonly role: UserRole.Host;
  readonly [tag]: 'Host';
}

/**
 * A user of the app
 */
export type User = Guest | Host;

/**
 * Contains functions for working with users
 */
export namespace User {
  /**
   * Constructor function for hosts
   * @param name The hosts name
   */
  export function makeHost(name: string): Host {
    const id = Guid.create().toString();
    return Object.freeze({
      name,
      role: UserRole.Host,
      id,
    } as Host);
  }

  /**
   * Constructor function for guests
   * @param name The guests name
   */
  export function makeGuest(name: string): Guest {
    const id = Guid.create().toString();
    return Object.freeze({
      name,
      role: UserRole.Guest,
      id,
    } as Guest);
  }

  /**
   * Gets the name of a user
   * @param user The user
   */
  export function nameOf(user: User): string {
    return user.name;
  }

  /**
   * Checks if this user has the specified role
   * @param user The user
   * @param role The rule
   */
  function hasRole(user: User, role: UserRole): boolean {
    return user.role === role;
  }

  /**
   * Gets the id of a user
   * @param user The user
   */
  export function idOf(user: User): string {
    return user.id;
  }

  /**
   * Checks if this user is a host
   * @param user The user
   */
  export function isHost(user: User): user is Host {
    return hasRole(user, UserRole.Host);
  }

  /**
   * Attempts to cast this user to a host.
   * Returns null if the user is a guest
   * @param user The user
   */
  export function asHost(user: User): Host | null {
    return isHost(user) ? user : null;
  }

  /**
   * Checks if this user is a guest
   * @param user The user
   */
  export function isGuest(user: User): user is Guest {
    return hasRole(user, UserRole.Guest);
  }

  /**
   * Attempts to cast this user to a guest.
   * Returns null if the user is a host
   * @param user The user
   */
  export function asGuest(user: User): Guest | null {
    return isGuest(user) ? user : null;
  }
}
