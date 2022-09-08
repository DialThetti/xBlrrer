import { Matrix } from '@dialthetti/feather-engine-core';
import Tile from './tile';
import TileMath from './tile.math';
export default class TileResolver {
    protected tiles: Matrix<Tile>;
    protected math: TileMath;
    constructor(tiles: Matrix<Tile>, tilesize: number);
}
