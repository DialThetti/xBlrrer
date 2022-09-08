import { Canvas, Loader } from '@dialthetti/feather-engine-core';
import { TileSet } from '@dialthetti/feather-engine-graphics';
import { TiledTileset } from '../model/tiled-tileset.model';
import { TsxModel } from '../model/tsx.model';
export default class TiledTilesetLoader implements Loader<TiledTileset> {
    private path;
    private idOffset;
    directory: string;
    onlyRequiredIds?: number[];
    loader: () => Promise<TsxModel>;
    imageLoader: (path: string) => Promise<Canvas>;
    createTileSet: (img: Canvas, tsxModel: TsxModel) => TileSet;
    constructor(path: string, idOffset: number);
    filteredBy(ids: number[]): TiledTilesetLoader;
    load(): Promise<TiledTileset>;
}
