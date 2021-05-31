import { TileSet } from 'feather-engine-graphics';
import { TsxTileModel } from './tsx.model';

export interface TiledTileset {
    tileset: TileSet;
    tileMatrix: { [id: number]: TsxTileModel };
}
