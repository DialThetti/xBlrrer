import Vector from '@engine/core/math/vector';
import { TiledMap } from '@engine/tiled/model/tiled-map.model';

export default interface PlatformerLevel {
    tiledMapPath: string;

    parallax?: { img: string; speed: number; y: number }[];

    estimateTime: number;
    bgm?: string;

    entities?: { name: string; pos: number[] }[];

    startPosition: Vector;

    tiledMap: TiledMap;
}
