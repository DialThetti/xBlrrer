import { Range } from '@dialthetti/feather-engine-core';
export default class TileMath {
    private tilesize;
    constructor(tilesize: number);
    toIndex(pos: number): number;
    toIndexRange(r: Range): number[];
}
