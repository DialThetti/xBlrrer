import TileSet from '../../engine/rendering/tileSet';
import { TsxTileModel } from './tsx.model';

export interface TiledTileset {
    tileset: TileSet;
    tileMatrix: { [id: number]: TsxTileModel };
}
