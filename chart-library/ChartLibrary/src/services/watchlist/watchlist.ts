
export enum WatchlistType {
    All = 1,
    Indices,
    Sector,
    UserDefined,
    Trading
}

export interface Watchlist {
    type: WatchlistType,
    name: string,
    id: string,
    owner?: string,
    sectorId?: number,
    symbols?:{[key:string]:string}
}


