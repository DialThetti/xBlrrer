import Tile from '@engine/core/world/tiles/tile';
import { BoundingBox, Matrix } from '@dialthetti/feather-engine-core';
import { TileSet } from '@dialthetti/feather-engine-graphics';

export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: { matrix: Matrix<Tile>; name: string; frontLayer: boolean; dynamic: boolean }[];
    width: number;
    height: number;
    viewPorts: BoundingBox[];
}
