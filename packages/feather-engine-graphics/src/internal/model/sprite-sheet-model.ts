export interface SpriteSheetModel {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    imageURL: string;
    tileW: number;
    tileH: number;
    tiles: {
        name: string;
        index: number[];
    }[];
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
