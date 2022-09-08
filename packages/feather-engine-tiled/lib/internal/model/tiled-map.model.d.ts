import { BoundingBox, Matrix } from '@dialthetti/feather-engine-core';
import { TileSet } from '@dialthetti/feather-engine-graphics';
import Tile from '../world/tiles/tile';
export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: Layer[];
    width: number;
    height: number;
    viewPorts: BoundingBox[];
    entities: {
        prefab: string;
        position: {
            x: number;
            y: number;
        };
        properties: {
            [name: string]: unknown;
        };
    }[];
}
export interface Layer {
    matrix: Matrix<Tile>;
    name: string;
    frontLayer: boolean;
    dynamic: boolean;
}
