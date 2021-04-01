import { cross, intRange } from '../../engine/math/math';
import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import LevelSpec, { PatternSpec, PlacementSpec } from '../../model/LevelSpec';
import Level from '../world/level';

export default class TileCreator {
    constructor(private level: Level) {}

    public createTiles(levelSpec: LevelSpec): void {
        const { layers, patterns } = levelSpec;
        layers.forEach(background => {
            const tiles = new Matrix<Tile>();
            background.tiles.forEach(tile =>
                this.onRanges(tile.ranges, (x, y) => this.setTile(tiles, patterns, tile, x, y)),
            );
            this.level.tiles = tiles;
        });
    }

    private onRanges(ranges: number[][], callback: (x: number, y: number) => void): void {
        ranges
            .map(r => this.to4Range(r))
            .map(([x1, x2, y1, y2]) => ({ x1, xEnd: x1 + x2, y1, yEnd: y1 + y2 }))
            .forEach(({ x1, xEnd, y1, yEnd }) => {
                cross(intRange(x1, xEnd), intRange(y1, yEnd)).forEach(([x, y]) => {
                    callback(x, y);
                });
            });
    }

    private to4Range(r: number[]): number[] {
        switch (r.length) {
            case 0:
                return [1, 1, 1, 1];
            case 1:
                return [r[0], 1, 1, 1];
            case 2:
                return [r[0], 1, r[1], 1];
            case 3:
                return [r[0], r[1], r[2], 1];
            case 4:
            default:
                return [r[0], r[1], r[2], r[3]];
        }
    }

    private setTile(tiles: Matrix<Tile>, patterns: PatternSpec, tile: PlacementSpec, x: number, y: number): void {
        if (tile.tags && tile.tags.includes('pattern')) {
            const pattern = patterns[tile.name];
            pattern.tiles.forEach(p => {
                this.onRanges(p.ranges, (oX, oY) => this.setTile(tiles, patterns, p, x + oX, y + oY));
            });
        } else {
            tiles.set(x, y, new Tile(tile.name, tile.tags ? tile.tags : []));
        }
    }
}
