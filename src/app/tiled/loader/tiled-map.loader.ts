import Loader from '../../engine/io/loader';
import { loadJson } from '../../engine/io/loaders';
import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import { TiledMap } from '../model/tiled-map.model';
import { TmxModel } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TileMatrixCreator from './tile-matrix-creator';
import TiledTilesetLoader from './tiled-tileset.loader';

export default class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    loader = () => loadJson<TmxModel>(this.path);
    tilesetLoader = (tileset) => new TiledTilesetLoader(this.directory + tileset.source, tileset.firstgid).load();
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

        const tilesets = await Promise.all([...tmx.tilesets].map(async (tileset) => this.tilesetLoader(tileset)));
        // TODO merge tilesets
        const tiledMap = {
            tileset: tilesets[0].tileset,
            tileSize: w,
        } as TiledMap;
        tiledMap.layers = this.createTileMatrixes(tmx, tilesets[0].tileMatrix);
        return tiledMap;
    }

    createTileMatrixes(tmx: TmxModel, tileProps: { [id: number]: TsxTileModel }): Matrix<Tile>[] {
        const tileCreator = new TileMatrixCreator(tileProps);
        return tmx.layers.map((layer) => tileCreator.create(layer));
    }
}
