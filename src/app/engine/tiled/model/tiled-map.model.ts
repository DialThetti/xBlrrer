import TileSet from '@engine/core/rendering/tileSet';
import Tile from '@engine/core/world/tiles/tile';
import { BoundingBox, Matrix } from 'feather-engine-core';

export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: { matrix: Matrix<Tile>; name: string }[];
    width: number;
    height: number;
    viewPorts: BoundingBox[];
}
