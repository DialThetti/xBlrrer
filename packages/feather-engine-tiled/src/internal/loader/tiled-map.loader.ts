import { BoundingBox, Loader, loadJson, Matrix, Vector } from '@dialthetti/feather-engine-core';
import { mergeImageContainer, TileSet } from '@dialthetti/feather-engine-graphics';
import { TiledMap } from '../model/tiled-map.model';
import { TiledTileset } from '../model/tiled-tileset.model';
import * as Tmx from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import { distinct, flatMap } from '../polyfill';
import Tile from '../world/tiles/tile';
import TileMatrixCreator from './tile-matrix-creator';
import TiledTilesetLoader from './tiled-tileset.loader';

export default class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    loader = (): Promise<Tmx.TmxModel<any>> => loadJson<Tmx.TmxModel<any>>(this.path);
    tilesetLoader = (
        tileset: {
            firstgid: number;
            source: string;
        },
        ids: number[],
    ): Promise<TiledTileset> => new TiledTilesetLoader(this.directory + tileset.source, tileset.firstgid).load();
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

        const tileset = this.merge(tilesets);
        const viewPorts = this.getViewPorts(tmx);
        const entities = this.getEntities(tmx);
        const tiledMap = {
            tileset: tileset.tileset,
            tileSize: w,
            viewPorts,
            entities,
        } as TiledMap;
        tiledMap.layers = this.createTileMatrixes(tmx, tileset.tileMatrix);
        if (tmx.infinite) {
            tiledMap.width = tmx.width * (tmx.layers[0] as Tmx.InfiniteTmxLayer).width;
            tiledMap.height = tmx.width * (tmx.layers[0] as Tmx.InfiniteTmxLayer).height;
        } else {
            tiledMap.width = tmx.width;
            tiledMap.height = tmx.height;
        }
        return tiledMap;
    }

    getUsedTileIds(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): number[] {
        const x = tmx.layers
            .filter((layer) => layer.visible)
            .filter((layer) => layer.type === 'tilelayer')
            .map((layer) => {
                if ('chunks' in layer) {
                    return distinct(flatMap((layer as Tmx.InfiniteTmxLayer).chunks.map((a) => distinct(a.data))));
                }
                if ('data' in layer) {
                    return distinct((layer as Tmx.FiniteTmxLayer).data);
                }
                return [];
            });
        return distinct(flatMap(x));
    }

    getViewPorts(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): BoundingBox[] {
        const x = flatMap(
            tmx.layers
                .filter((layer) => layer.visible)
                .filter((layer) => layer.type === 'objectgroup' && layer.name == 'ViewPorts')
                .map((layer) =>
                    (layer as Tmx.TmxObjectLayer).objects.map(
                        (o) => new BoundingBox(new Vector(o.x, o.y), new Vector(o.width, o.height)),
                    ),
                ),
        );
        if (x.length == 0) {
            return [
                new BoundingBox(new Vector(0, 0), new Vector(tmx.width * tmx.tilewidth, tmx.height * tmx.tileheight)),
            ];
        }
        return x;
    }
    /**
     * Get all Entities from the EntityLayer. The Entity Layer must be an object layer with the name "Entities"
     * @param tmx
     * @returns entity prefab ids with their position
     */
    getEntities(
        tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>,
    ): { prefab: string; position: { x: number; y: number }; properties: { [name: string]: unknown } }[] {
        const x = flatMap(
            tmx.layers
                .filter((layer) => layer.visible)
                .filter((layer) => layer.type === 'objectgroup' && layer.name == 'Entities')
                .map((layer) =>
                    (layer as Tmx.TmxObjectLayer).objects
                        .map((o) => ({ ...o, prefabId: this.getProperty(o.properties, 'entity_prefab') }))
                        .filter(({ prefabId }) => prefabId !== undefined)
                        .map((o) => ({
                            prefab: o.prefabId as string,
                            position: { x: o.x, y: o.y },
                            properties: this.toMap(o.properties),
                        })),
                ),
        );

        return x;
    }

    toMap(o: { name: string; type: string; value: unknown }[]): { [name: string]: unknown } {
        const x = {} as any;
        o.forEach((entry) => (x[entry.name] = entry.value));
        return x;
    }

    getProperty(propertyMap: { name: string; type: string; value: unknown }[], name: string): unknown | undefined {
        return propertyMap
            .filter((p) => p.name == name)
            .map((p) => p.value)
            .pop();
    }
    createTileMatrixes(
        tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>,
        tileProps: { [id: number]: TsxTileModel },
    ): { matrix: Matrix<Tile>; name: string; frontLayer: boolean; dynamic: boolean }[] {
        const tileCreator = new TileMatrixCreator(tileProps);
        return tmx.layers
            .filter((a) => a.visible)
            .filter((layer) => layer.type === 'tilelayer')
            .map((layer) => ({
                name: layer.name,
                matrix: tileCreator.create(layer as Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer),
                frontLayer: this.hasEnabled(layer as Tmx.TmxLayer, 'frontLayer'),
                dynamic: this.hasEnabled(layer as Tmx.TmxLayer, 'dynamic'),
            }));
    }

    hasEnabled(layer: Tmx.TmxLayer, key: string): boolean {
        return layer && layer.properties.some((t) => t.name === key && (t.value as boolean) === true);
    }

    merge(tilesets: TiledTileset[]): TiledTileset {
        return tilesets.reduce((o, c) => ({
            tileMatrix: { ...o.tileMatrix, ...c.tileMatrix },
            tileset: mergeImageContainer(o.tileset, c.tileset) as TileSet,
        }));
    }
}
