import { Canvas, Loader, loadImage, loadJson } from 'feather-engine-core';
import { createAnim, TileSet } from 'feather-engine-graphics';
import { TiledTileset } from '../model/tiled-tileset.model';
import { TsxModel, TsxTileModel } from '../model/tsx.model';
export default class TiledTilesetLoader implements Loader<TiledTileset> {
    directory: string;
    onlyRequiredIds: number[];
    loader = () => loadJson<TsxModel>(this.path);
    imageLoader = (path) => loadImage(path);
    createTileSet = (img: Canvas, tsxModel: TsxModel) => new TileSet(img, tsxModel.tilewidth, tsxModel.tileheight);

    constructor(private path: string, private idOffset: number) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }

    filteredBy(ids: number[]): TiledTilesetLoader {
        this.onlyRequiredIds = ids;
        return this;
    }

    async load(): Promise<TiledTileset> {
        const tsxModel = await this.loader();

        const img = await this.imageLoader(this.directory + tsxModel.image);
        const tileset = this.createTileSet(img, tsxModel);
        const tileMatrix: { [id: number]: TsxTileModel } = {};
        for (let index = 0; index < tsxModel.tilecount; index++) {
            const id = index + this.idOffset;
            if (this.onlyRequiredIds && !this.onlyRequiredIds.includes(id)) {
                continue;
            }
            const x = index % tsxModel.columns;
            const y = Math.floor(index / tsxModel.columns);

            tileset.defineTile(`${id}`, x, y);
            if (tsxModel.tiles) {
                tileMatrix[index + this.idOffset] = tsxModel.tiles[index];
                if (tsxModel.tiles[index]?.animation) {
                    console.debug('add 1 animation ' + id);
                    tileset.defineAnim(
                        `${id}`,
                        createAnim(
                            tsxModel.tiles[index]?.animation.map((a) => '' + (a.tileid + this.idOffset)),
                            tsxModel.tiles[index]?.animation[0].duration / 1000,
                            true,
                        ),
                    );
                }
            }
        }
        this.finalize();
        return { tileset, tileMatrix };
    }

    finalize() {
        delete this.createTileSet;
        delete this.loader;
        delete this.onlyRequiredIds;
        delete this.imageLoader;
    }
}
