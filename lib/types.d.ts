declare type Url = string

declare type PartyCode = string

declare type UserName = string

declare interface Artist {
    readonly name: string
}

declare interface Track {
    readonly name: string,
    readonly artists: Artist[]
    readonly albumArtUrl: Url
}

declare enum UserRole {
    Host, Guest
}

declare interface Guest {
    readonly name: UserName
    readonly role: UserRole.Guest
}

declare interface Host {
    readonly name: UserName
    readonly role: UserRole.Host
}

declare type User = Guest | Host

declare interface Party {
    readonly code: PartyCode,
    readonly name: string,
    readonly host: Host
    readonly guests: Guest[]
}
