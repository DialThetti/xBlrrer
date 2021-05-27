import { Matrix } from 'feather-engine-core';
import Tile from './tile';
import TileMath from './tile.math';

export default class TileResolver {
    protected math: TileMath;
    constructor(protected tiles: Matrix<Tile>, tilesize: number) {
        this.math = new TileMath(tilesize);
    }
}
