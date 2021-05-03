import BoundingBox from '@engine/core/math/boundingBox';
import Matrix from '@engine/core/math/matrix';
import TileSet from '@engine/core/rendering/tileSet';
import Tile from '@engine/core/world/tiles/tile';

export interface TiledMap {
    tileset: TileSet;
    tileSize: number;
    layers: { matrix: Matrix<Tile>; name: string }[];
    width: number;
    height: number;
    viewPorts: BoundingBox[];
}
