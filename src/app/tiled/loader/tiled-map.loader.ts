import Loader from '../../engine/io/loader';
import { loadJson } from '../../engine/io/loaders';
import Matrix from '../../engine/math/matrix';
import { distinct, flatMap } from '../../engine/polyfill';
import Tile from '../../engine/world/tiles/tile';
import { TiledMap } from '../model/tiled-map.model';
import { TiledTileset } from '../model/tiled-tileset.model';
import { TmxModel } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TileMatrixCreator from './tile-matrix-creator';
import TiledTilesetLoader from './tiled-tileset.loader';

export default class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    loader = () => loadJson<TmxModel>(this.path);
    tilesetLoader = (tileset, ids) =>
        new TiledTilesetLoader(this.directory + tileset.source, tileset.firstgid).filteredBy(ids).load();
    constructor(private path: string) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }
    public async load(): Promise<TiledMap> {
        const json = await this.loader();
        return this.map(json);
    }

    private async map(tmx: TmxModel): Promise<TiledMap> {
        const w = tmx.tilewidth;
        const h = tmx.tileheight;
        if (w !== h) {
            console.warn('tiles are not squared. May cause issues');
        }
        const ids: number[] = this.getUsedTileIds(tmx);
        console.log(`${ids.length} Tiles required for stage`);
        const tilesets = await Promise.all(
            [...tmx.tilesets].map(async (tileset) => this.tilesetLoader(tileset, ids)),
        );
        delete this.tilesetLoader;
        const tileset = this.merge(tilesets);
        // TODO merge tilesets
        const tiledMap = {
            tileset: tileset.tileset,
            tileSize: w,
        } as TiledMap;
        tiledMap.layers = this.createTileMatrixes(tmx, tileset.tileMatrix);
        return tiledMap;
    }

    getUsedTileIds(tmx: TmxModel): number[] {
        return distinct(
            flatMap(
                tmx.layers
                    .filter((layer) => layer.visible)
                    .map((layer) => {
                        return distinct(flatMap(layer.chunks.map((a) => distinct(a.data))));
                    }),
            ),
        );
    }

    createTileMatrixes(tmx: TmxModel, tileProps: { [id: number]: TsxTileModel }): Matrix<Tile>[] {
        const tileCreator = new TileMatrixCreator(tileProps);
        return tmx.layers.filter((a) => a.visible).map((layer) => tileCreator.create(layer));
    }

    merge(tilesets: TiledTileset[]): TiledTileset {
        const t = {} as TiledTileset;

        return tilesets.reduce((o, c) => {
            const t = o.tileset;
            t.images = { ...t.images, ...c.tileset.images };
            return { tileMatrix: { ...o.tileMatrix, ...c.tileMatrix }, tileset: t };
        });
    }
}
