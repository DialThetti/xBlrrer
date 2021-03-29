import { cross } from '../../math/math';
import Matrix from '../../math/matrix';
import Range from '../../math/range.interface';
import { notNull } from '../../polyfill';
import Tile from '../../world/tiles/tile';
import TileMath from '../../world/tiles/tile.math';

export default class TileColliderLayer {
    private math: TileMath;
    constructor(protected tiles: Matrix<Tile>, private tilesize: number) {
        this.math = new TileMath(tilesize);
    }
    /**
     * get a range of tiles. Each position will be scaled by tilesize
     * @param x
     * @param y
     * @param tile
     */
    get(x: number | Range, y: number | Range): PositionedTile[] {
        if (typeof x === 'number') {
            x = { from: x, to: x + 1 } as Range;
        }
        if (typeof y === 'number') {
            y = { from: y, to: y + 1 } as Range;
        }
        return cross(this.math.toIndexRange(x), this.math.toIndexRange(y))
            .map(([xRange, yRange]) => this.getByIndex(xRange, yRange))
            .filter(notNull);
    }
    /**
     * set a range of tiles. Each position will be scaled by tilesize
     * @param x
     * @param y
     * @param tile
     */
    setByRange(x: Range, y: Range, tile: Tile): void {
        cross(this.math.toIndexRange(x), this.math.toIndexRange(y)).forEach(([x, y]) => this.tiles.set(x, y, tile));
    }
    /**
     * Get a tile by index. Note: this is the only method not scaled by tilesize
     * @param x
     * @param y
     * @returns
     */
    getByIndex(x: number, y: number): PositionedTile {
        const tile = this.tiles.get(x, y);
        if (!tile) {
            return null;
        }
        return {
            tile,
            y: { from: y * this.tilesize, to: (y + 1) * this.tilesize },
            x: { from: x * this.tilesize, to: (x + 1) * this.tilesize },
        };
    }

    /**
     * remove a tile or a range of tiles, scaled by tilesize
     * @param x
     * @param y
     */
    delete(x: number | Range, y: number | Range): void {
        if (typeof x === 'number') {
            x = { from: x, to: x + 1 } as Range;
        }
        if (typeof y === 'number') {
            y = { from: y, to: y + 1 } as Range;
        }
        console.log(x, y);
        this.setByRange(x, y, null);
    }
}

export interface PositionedTile {
    tile: Tile;
    x: Range;
    y: Range;
}
