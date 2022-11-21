/**
 * Constructor function for hosts
 * @param name The hosts name
 */
export function makeHost(name: UserName): Host {
    return Object.freeze({name, role: UserRole.Host})
}

/**
 * Constructor function for guests
 * @param name The guests name
 */
export function makeGuest(name: UserName): Guest {
    return Object.freeze({name, role: UserRole.Guest})
}

/**
 * Checks if this user has the specified role
 * @param user The user
 * @param role The rule
 */
function hasRole(user: User, role: UserRole): boolean {
    return user.role === role
}

/**
 * Checks if this user is a host
 * @param user The user
 */
export function isHost(user: User): boolean {
    return hasRole(user, UserRole.Host)
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
export function isGuest(user: User): boolean {
    return hasRole(user, UserRole.Guest)
}

/**
 * Attempts to cast this user to a guest.
 * Returns null if the user is a host
 * @param user The user
 */
export function asGuest(user: User): Host | null {
    return isGuest(user) ? user : null;
}

/**
 * Promotes a guest to be a host
 * @param guest The guest
 */
export function promoteToHost(guest: Guest): Host {
    return makeHost(guest.name)
}
