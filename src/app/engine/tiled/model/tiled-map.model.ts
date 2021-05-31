import Tile from '@engine/core/world/tiles/tile';
import { BoundingBox, Matrix } from 'feather-engine-core';
import { TileSet } from 'feather-engine-graphics';

export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: { matrix: Matrix<Tile>; name: string }[];
    width: number;
    height: number;
    viewPorts: BoundingBox[];
}
