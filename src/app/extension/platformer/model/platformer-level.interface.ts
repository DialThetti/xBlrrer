import { Vector } from '@dialthetti/feather-engine-core';

export default interface PlatformerLevelData {
    tiledMapPath: string;

    estimateTime: number;
    bgm?: string;
    parallax?: {
        img: string,
        speed: number,
        y: number
    }[];

    startPosition: Vector;

    minimap: string[];
}
