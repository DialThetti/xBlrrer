import Loader from '../../engine/io/loader';
import { loadJson } from '../../engine/io/loaders';
import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import { Chunk, Layer, TiledMap } from '../model/tiled-map.model';
import { TiledTile } from '../model/tiled-tile-set.model';
import TmxData, { TmxChunk } from '../model/tmx.data';
import TileMatrixCreator from './tile-matrix-creator';
import TiledTilesetLoader from './tiled-tileset.loader';

export default class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    constructor(private path: string) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }
    public async load(): Promise<TiledMap> {
        const json = await loadJson<TmxData>(this.path);
        return this.map(json);
    }

    private async map(tmx: TmxData): Promise<TiledMap> {
        const w = tmx.tilewidth;
        const h = tmx.tileheight;
        if (w !== h) {
            console.warn('tiles are not squared. May cause issues');
        }
        const renderOrder = tmx.renderorder;
        const tilesets = await Promise.all(
            [...tmx.tilesets].map(async (tileset) => ({
                tileset: await new TiledTilesetLoader(this.directory + tileset.source, tileset.firstgid).load(),
            })),
        );

        const tiledMap = {
            spriteSheet: tilesets[0].tileset.spriteSheet,
            renderOrder,
            layers: this.createLayers(tmx),
            tileSize: w,
        } as TiledMap;
        tiledMap.matixes = this.createTileMatrixes(tiledMap, tilesets[0].tileset.tileMatrix);
        return tiledMap;
    }

    private createLayers(tmx: TmxData): Layer[] {
        return [...tmx.layers].map((layer) => {
            const chunks = [...layer.chunks].map((chunk) => this.toChunk(chunk));
            return { chunks, id: layer.id, name: layer.name };
        });
    }

    private toChunk(chunk: TmxChunk): Chunk {
        const elements: number[][] = [];
        for (let i = 0; i < chunk.data.length; i += chunk.width) {
            const temparray = chunk.data.slice(i, i + chunk.width);
            elements.push(temparray);
        }
        return {
            x: chunk.x,
            y: chunk.y,
            width: chunk.width,
            height: chunk.height,
            elements,
        };
    }

    private createTileMatrixes(map: TiledMap, tileProps: { [id: number]: TiledTile }): Matrix<Tile>[] {
        const tileCreator = new TileMatrixCreator(tileProps);
        return map.layers.map((layer) => tileCreator.create(layer));
    }
}
