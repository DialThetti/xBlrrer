export interface SSPSpriteSheet {
    frames: {
        [name: string]: {
            frame: Rect;
            rotated: boolean;
            trimmed: boolean;
            spriteSourceSize: Rect;
            sourceSize: {
                w: number;
                height: number;
            };
        };
    };
    meta: {
        app: string;
        version: string;
        image: string;
        format: string;
        size: {
            w: number;
            h: number;
        };
        scale: number;
    };
}

export interface AnimatedSSPSpriteSheet extends SSPSpriteSheet {
    animations: {
        [name: string]: {
            frameLen: number;
            loop?: boolean;
            frames: string[];
        };
    };
}

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
