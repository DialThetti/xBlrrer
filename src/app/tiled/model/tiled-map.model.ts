import Matrix from '../../engine/math/matrix';
import TileSet from '../../engine/rendering/tileSet';
import Tile from '../../engine/world/tiles/tile';

export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: Matrix<Tile>[];
    width: number;
    height: number;
}
