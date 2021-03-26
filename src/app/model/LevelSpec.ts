import Vector from '../engine/math/vector';

export default interface LevelSpec {
    tileSet: string;
    background?: string;
    estimateTime: number;
    bgm?: string;

    patterns?: PatternSpec;

    layers: { tiles: PlacementSpec[] }[];

    entities?: { name: string; pos: number[] }[];

    startPosition: Vector;
}

export interface PatternSpec {
    [key: string]: { tiles: PlacementSpec[] };
}

export interface PlacementSpec {
    name: string;
    tags?: string[];
    ranges: number[][];
}
