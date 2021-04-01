import Loader from '../../engine/io/loader';
import { loadXML } from '../../engine/io/loaders';
import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import TileCreator from './TileCreator';
import { Layer, TiledMap } from '../model/tiled.map';
import TiledTilesetLoader from './tiled.tileset.loader';
import { TiledTile } from '../model/tileset.model';

export class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    constructor(private path: string) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }
    async load(): Promise<TiledMap> {
        const xml = await loadXML(this.path);
        return this.map(xml);
    }

    async map(xml: XMLDocument): Promise<TiledMap> {
        const map = xml.getElementsByTagName('map')[0];
        const w = map.getAttribute('tilewidth');
        const h = map.getAttribute('tileheight');
        const renderOrder = map.getAttribute('renderorder');
        const tilesets = await Promise.all(
            [...map.getElementsByTagName('tileset')]
                .map((a) => ({
                    startId: parseInt(a.getAttribute('firstgid')),
                    source: a.getAttribute('source'),
                }))
                .map(async (a) => ({
                    ...a,
                    tileset: await new TiledTilesetLoader(this.directory + a.source, a.startId).load(),
                })),
        );

        const tiledMap = {
            spriteSheet: tilesets[0].tileset.spriteSheet,
            layers: this.createLayers(map),
            tileSize: parseInt(w),
        } as TiledMap;
        tiledMap.matixes = this.createLevelSpec(tiledMap, tilesets[0].tileset.tileMatrix);
        return tiledMap;
    }

    createLayers(map: HTMLMapElement): Layer[] {
        return [...map.getElementsByTagName('layer')].map((a) => {
            const data = a.getElementsByTagName('data')[0];
            const chunks = [...data.getElementsByTagName('chunk')].map((chunk) => {
                const r = {
                    x: parseInt(chunk.getAttribute('x')),
                    y: parseInt(chunk.getAttribute('y')),
                    width: parseInt(chunk.getAttribute('width')),
                    height: parseInt(chunk.getAttribute('height')),
                    elements: chunk.textContent.split(',\n').map((l) => l.split(',').map((i) => parseInt(i))),
                };
                return r;
            });
            return { chunks, id: parseInt(a.getAttribute('id')), name: a.getAttribute('name') };
        });
    }
    createLevelSpec(map: TiledMap, tileProps: { [id: number]: TiledTile }): Matrix<Tile>[] {
        return new TileCreator().createTiles(map, tileProps);
    }
}
