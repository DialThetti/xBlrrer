import { Matrix } from '@dialthetti/feather-engine-core';
import { FiniteTmxLayer, InfiniteTmxLayer } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import Tile from '../world/tiles/tile';
export default class TileMatrixCreator {
    private tileProps;
    booleanTags: string[];
    constructor(tileProps: {
        [id: number]: TsxTileModel;
    });
    create(layer: InfiniteTmxLayer | FiniteTmxLayer): Matrix<Tile>;
    private handleFiniteLayer;
    private handleInfiniteLayer;
    private setTile;
    hasEnabled(tile: TsxTileModel, key: string): boolean;
}
