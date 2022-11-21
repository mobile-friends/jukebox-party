declare type Name = string

declare type Url = string

declare interface Artist {
    name: Name
}

declare interface Track {
    name: Name,
    artists: Artist[]
    albumArtUrl: Url
}
