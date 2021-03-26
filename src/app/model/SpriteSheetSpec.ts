import TileSpec from './TileSpec';

export default interface SpriteSheetSpec {
    imageURL: string;
    tileW: number;
    tileH: number;
    tiles: TileSpec[];
    animations?: [
        {
            name: string;
            frameLen: number;
            loop?: boolean;
            frames: string[];
        },
    ];
    frames?: [
        {
            name: string;
            rect: number[];
        },
    ];
}
