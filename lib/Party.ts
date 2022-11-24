/**
 * Constructor function for parties
 * @param code The parties code
 * @param name The parties name
 * @param host The parties host
 * @param guests The parties guests
 */
export function makeParty(
  code: PartyCode,
  name: string,
  host: Host,
  guests: Guest[]
): Party {
  let party: Party = { code, name, host, guests };
  return Object.freeze(party);
}

/**
 * Starts a new party
 * @param code The parties code
 * @param name The parties name
 * @param host The parties host-user
 */
export function makeNewParty(code: PartyCode, name: string, host: Host) {
  return makeParty(code, name, host, []);
}

/**
 * Gets all users at a party
 * @param party The party
 */
export function getUsersIn(party: Party): User[] {
  return [party.host, ...party.guests];
}

/**
 * Adds a guest to the party and returns the updated party
 * @param party The party
 * @param guest The guest
 */
export function addGuestTo(party: Party, guest: Guest): Party {
  let newGuests = party.guests.concat(guest);
  return makeParty(party.name, party.code, party.host, newGuests);
}
