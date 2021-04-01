export interface TiledTileSet {
    columns: number;

    image: string;
    imageheight: number;
    imageweight: number;
    margin: number;

    name: string;
    spacing: number;
    tilecount: number;

    tiledversion: string;
    tileheight: number;
    tilewidth: number;
    type: string;
    version: string;
    tiles?: TiledTile[];
}

export interface TiledTile {
    id: number;
    properties: { name: string; type: string; value: any }[];
}
