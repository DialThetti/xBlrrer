import { TileSet } from '@dialthetti/feather-engine-graphics';
import { TsxTileModel } from './tsx.model';
export interface TiledTileset {
    tileset: TileSet;
    tileMatrix: {
        [id: number]: TsxTileModel;
    };
}
