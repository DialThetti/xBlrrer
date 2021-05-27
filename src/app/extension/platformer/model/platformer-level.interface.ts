import { Vector } from 'feather-engine-core';

export default interface PlatformerLevelData {
    tiledMapPath: string;

    estimateTime: number;
    bgm?: string;

    entities?: { name: string; pos: number[] }[];

    startPosition: Vector;
}
