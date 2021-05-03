import TileSet from '@engine/core/rendering/tileSet';
import { TsxTileModel } from './tsx.model';

export interface TiledTileset {
    tileset: TileSet;
    tileMatrix: { [id: number]: TsxTileModel };
}
