import { BoundingBox, Loader, Matrix } from '@dialthetti/feather-engine-core';
import { TiledMap } from '../model/tiled-map.model';
import { TiledTileset } from '../model/tiled-tileset.model';
import * as Tmx from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import Tile from '../world/tiles/tile';
export default class TiledMapLoader implements Loader<TiledMap> {
    private path;
    directory: string;
    loader: () => Promise<Tmx.TmxModel<any>>;
    tilesetLoader: (tileset: {
        firstgid: number;
        source: string;
    }, ids: number[]) => Promise<TiledTileset>;
    constructor(path: string);
    load(): Promise<TiledMap>;
    private map;
    getUsedTileIds(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): number[];
    getViewPorts(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): BoundingBox[];
    /**
     * Get all Entities from the EntityLayer. The Entity Layer must be an object layer with the name "Entities"
     * @param tmx
     * @returns entity prefab ids with their position
     */
    getEntities(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>): {
        prefab: string;
        position: {
            x: number;
            y: number;
        };
        properties: {
            [name: string]: unknown;
        };
    }[];
    toMap(o: {
        name: string;
        type: string;
        value: unknown;
    }[]): {
        [name: string]: unknown;
    };
    getProperty(propertyMap: {
        name: string;
        type: string;
        value: unknown;
    }[], name: string): unknown | undefined;
    createTileMatrixes(tmx: Tmx.TmxModel<Tmx.FiniteTmxLayer | Tmx.InfiniteTmxLayer>, tileProps: {
        [id: number]: TsxTileModel;
    }): {
        matrix: Matrix<Tile>;
        name: string;
        frontLayer: boolean;
        dynamic: boolean;
    }[];
    hasEnabled(layer: Tmx.TmxLayer, key: string): boolean;
    merge(tilesets: TiledTileset[]): TiledTileset;
}
