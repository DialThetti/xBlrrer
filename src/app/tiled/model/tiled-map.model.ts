import Matrix from '../../engine/math/matrix';
import TileSet from '../../engine/rendering/tileSet';
import Tile from '../../engine/world/tiles/tile';

export class TiledMap {
    spriteSheet: TileSet;
    tileSize: number;
    matixes: Matrix<Tile>[];
    renderOrder: string;
    layers: Layer[];
}

export class Layer {
    chunks: Chunk[];
    id: number;
    name: string;
}

export class Chunk {
    x: number;
    y: number;
    width: number;
    height: number;
    elements: number[][];
}
