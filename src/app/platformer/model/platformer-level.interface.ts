import Vector from '../../engine/math/vector';

export default interface PlatformerLevelData {
    tiledMapPath: string;

    estimateTime: number;
    bgm?: string;

    entities?: { name: string; pos: number[] }[];

    startPosition: Vector;
}
