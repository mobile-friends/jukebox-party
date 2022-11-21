declare type Url = string

declare type Id = number

declare type PartyCode = string

declare type UserName = string

declare interface Artist {
    name: string
}

declare interface Track {
    name: string,
    artists: Artist[]
    albumArtUrl: Url
}

declare interface User {
    id: Id,
    name: UserName
}

declare interface Party {
    name: string,
    code: PartyCode,
    host: User,
    guests: User[]
}
