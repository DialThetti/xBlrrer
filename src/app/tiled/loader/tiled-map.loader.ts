import Loader from '../../engine/io/loader';
import { loadJson } from '../../engine/io/loaders';
import Matrix from '../../engine/math/matrix';
import { distinct, flatMap } from '../../engine/polyfill';
import Tile from '../../engine/world/tiles/tile';
import { TiledMap } from '../model/tiled-map.model';
import { TiledTileset } from '../model/tiled-tileset.model';
import * as Tmx from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TileMatrixCreator from './tile-matrix-creator';
import TiledTilesetLoader from './tiled-tileset.loader';

export default class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    loader = () => loadJson<Tmx.TmxModel<any>>(this.path);
    tilesetLoader = (tileset, ids) =>
        new TiledTilesetLoader(this.directory + tileset.source, tileset.firstgid).filteredBy(ids).load();
    constructor(private path: string) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }
    public async load(): Promise<TiledMap> {
        const json = await this.loader();
        return this.map(json);
    }
    private async map(tmx: Tmx.FiniteTmxModel | Tmx.InfiniteTmxModel): Promise<TiledMap> {
        const w = tmx.tilewidth;
        const h = tmx.tileheight;
        if (w !== h) {
            console.warn('tiles are not squared. May cause issues');
        }
        const ids: number[] = this.getUsedTileIds(tmx);
        console.log(`${ids.length} Tiles required for stage`);
        const tilesets = await Promise.all([...tmx.tilesets].map(async (tileset) => this.tilesetLoader(tileset, ids)));
        delete this.tilesetLoader;
        const tileset = this.merge(tilesets);
        const tiledMap = {
            tileset: tileset.tileset,
            tileSize: w,
        } as TiledMap;
        tiledMap.layers = this.createTileMatrixes(tmx, tileset.tileMatrix);
        if (tmx.infinite) {
            tiledMap.width = tmx.width * tmx.layers[0].width;
            tiledMap.height = tmx.width * tmx.layers[0].height;
        } else {
            tiledMap.width = tmx.width;
            tiledMap.height = tmx.height;
        }
        return tiledMap;
    }

    getUsedTileIds(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): number[] {
        return distinct(
            flatMap(
                tmx.layers
                    .filter((layer) => layer.visible)
                    .map((layer) => {
                        if ('chunks' in layer) {
                            return distinct(
                                flatMap((layer as Tmx.InfiniteTmxLayer).chunks.map((a) => distinct(a.data))),
                            );
                        }
                        if ('data' in layer) {
                            return distinct((layer as Tmx.FiniteTmxLayer).data);
                        }
                    }),
            ),
        );
    }

    createTileMatrixes(
        tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>,
        tileProps: { [id: number]: TsxTileModel },
    ): Matrix<Tile>[] {
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
