import Vector from '../../engine/math/vector';
import { TiledMap } from '../../tiled/model/tiled-map.model';

export default interface PlatformerLevel {
    tiledMapPath: string;

    background?: string;
    estimateTime: number;
    bgm?: string;

    entities?: { name: string; pos: number[] }[];

    startPosition: Vector;

    tiledMap: TiledMap;
}
