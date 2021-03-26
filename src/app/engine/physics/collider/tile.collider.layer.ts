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

    getByRange(x: Range, y: Range): PositionedTile[] {
        return cross(this.math.toIndexRange(x), this.math.toIndexRange(y))
            .map(([x, y]) => this.getByIndex(x, y))
            .filter(notNull);
    }

    setByRange(x: Range, y: Range, tile: Tile): void {
        cross(this.math.toIndexRange(x), this.math.toIndexRange(y)).map(([x, y]) => this.tiles.set(x, y, tile));
    }

    getByIndex(x: number, y: number): PositionedTile {
        const tile = this.tiles.get(x, y);
        if (tile) {
            return {
                tile,

                y: { from: y * this.tilesize, to: (y + 1) * this.tilesize },
                x: { from: x * this.tilesize, to: (x + 1) * this.tilesize },
            };
        }
    }

    getByPosition(x: number, y: number): PositionedTile {
        return this.getByIndex(this.math.toIndex(x), this.math.toIndex(y));
    }

    delete(x: number | Range, y: number | Range): void {
        if (typeof x === 'number') {
            x = { from: x, to: x } as Range;
        }
        if (typeof y === 'number') {
            y = { from: y, to: y } as Range;
        }
        this.setByRange(x as Range, y as Range, undefined);
    }
}

export interface PositionedTile {
    tile: Tile;
    x: Range;
    y: Range;
}
