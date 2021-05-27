import BoundingBox from '@engine/core/math/boundingBox';
import Matrix from '@engine/core/math/matrix';
import Vector from '@engine/core/math/vector';
import { distinct, flatMap } from '@engine/core/polyfill';
import { mergeImageContainer } from '@engine/core/rendering/image.container';
import TileSet from '@engine/core/rendering/tileSet';
import Tile from '@engine/core/world/tiles/tile';
import { Loader, loadJson } from 'feather-engine-core';
import { TiledMap } from '../model/tiled-map.model';
import { TiledTileset } from '../model/tiled-tileset.model';
import * as Tmx from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TileMatrixCreator from './tile-matrix-creator';
import TiledTilesetLoader from './tiled-tileset.loader';

export default class TiledMapLoader implements Loader<TiledMap> {
    directory: string;

    loader = () => loadJson<Tmx.TmxModel<any>>(this.path);
    tilesetLoader = (tileset, ids) => new TiledTilesetLoader(this.directory + tileset.source, tileset.firstgid).load();
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
        let viewPorts = this.getViewPorts(tmx);
        const tiledMap = {
            tileset: tileset.tileset,
            tileSize: w,
            viewPorts,
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
        return distinct(
            flatMap(
                tmx.layers
                    .filter((layer) => layer.visible)
                    .filter((layer) => layer.type === 'tilelayer')
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

    getViewPorts(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): BoundingBox[] {
        const x = flatMap(
            tmx.layers
                .filter((layer) => layer.visible)
                .filter((layer) => layer.type === 'objectgroup')
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
    createTileMatrixes(
        tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>,
        tileProps: { [id: number]: TsxTileModel },
    ): { matrix: Matrix<Tile>; name: string }[] {
        const tileCreator = new TileMatrixCreator(tileProps);
        return tmx.layers
            .filter((a) => a.visible)
            .filter((layer) => layer.type === 'tilelayer')
            .map((layer) => ({
                name: layer.name,
                matrix: tileCreator.create(layer as Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer),
            }));
    }

    merge(tilesets: TiledTileset[]): TiledTileset {
        const t = {} as TiledTileset;

        return tilesets.reduce((o, c) => {
            const t = mergeImageContainer(o.tileset, c.tileset) as TileSet;
            return { tileMatrix: { ...o.tileMatrix, ...c.tileMatrix }, tileset: t };
        });
    }
}
