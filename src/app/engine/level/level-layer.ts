import { notNull } from '@engine/core/polyfill';
import Tile from '@engine/core/world/tiles/tile';
import TileMath from '@engine/core/world/tiles/tile.math';
import { cross, Matrix, Range } from 'feather-engine-core';

export default class LevelLayer {
    private math: TileMath;
    constructor(protected tiles: { matrix: Matrix<Tile>; name: string }, private tilesize: number) {
        this.math = new TileMath(tilesize);
    }
    /**
     * get a range of tiles. Each position will be scaled by tilesize
     * @param x
     * @param y
     * @param tile - never null
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
        cross(this.math.toIndexRange(x), this.math.toIndexRange(y)).forEach(([x, y]) =>
            this.tiles.matrix.set(x, y, tile),
        );
    }
    /**
     * Get a tile by index. Note: this is the only method not scaled by tilesize
     * @param x
     * @param y
     * @returns
     */
    getByIndex(x: number, y: number): PositionedTile {
        const tile = this.tiles.matrix.get(x, y);
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
        this.setByRange(x, y, null);
    }

    get name(): string {
        return this.tiles.name;
    }
}

export interface PositionedTile {
    tile: Tile;
    x: Range;
    y: Range;
}
