import BoundingBox from '../../engine/math/boundingBox';
import Matrix from '../../engine/math/matrix';
import TileSet from '../../engine/rendering/tileSet';
import Tile from '../../engine/world/tiles/tile';

export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: { matrix: Matrix<Tile>; name: string }[];
    width: number;
    height: number;
    viewPorts: BoundingBox[];
}
