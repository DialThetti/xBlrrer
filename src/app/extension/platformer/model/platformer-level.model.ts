import { Vector } from '@dialthetti/feather-engine-core';
import { TiledMap } from '@dialthetti/feather-engine-tiled';

export interface PlatformerLevel {
    tiledMapPath: string;

    parallax?: { img: string; speed: number; y: number }[];

    estimateTime: number;
    bgm?: string;

    entities?: { name: string; pos: number[] }[];

    startPosition: Vector;

    tiledMap: TiledMap;
}
