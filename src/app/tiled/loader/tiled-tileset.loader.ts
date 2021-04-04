import Loader from '../../engine/io/loader';
import { loadImage, loadJson } from '../../engine/io/loaders';
import TileSet from '../../engine/rendering/tileSet';
import { TiledTileset } from '../model/tiled-tileset.model';
import { TsxModel, TsxTileModel } from '../model/tsx.model';

export default class TiledTilesetLoader implements Loader<TiledTileset> {
    directory: string;
    loader = () => loadJson<TsxModel>(this.path);
    imageLoader = (path) => loadImage(path);
    createTileSet = (img: HTMLImageElement, tsxModel: TsxModel) =>
        new TileSet(img, tsxModel.tilewidth, tsxModel.tileheight);

    constructor(private path: string, private idOffset: number) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }

    async load(): Promise<TiledTileset> {
        const tsxModel = await this.loader();

        const img = await this.imageLoader(this.directory + tsxModel.image);
        const tileset = this.createTileSet(img, tsxModel);
        const tileMatrix: { [id: number]: TsxTileModel } = {};
        for (let index = 0; index < tsxModel.tilecount; index++) {
            const x = index % tsxModel.columns;
            const y = Math.floor(index / tsxModel.columns);
            tileset.defineTile(`${index + this.idOffset}`, x, y);
            if (tsxModel.tiles) {
                tileMatrix[index + this.idOffset] = tsxModel.tiles[index];
            }
        }
        return { tileset, tileMatrix };
    }
}
