import { cross, intRange } from '../../engine/math/math';
import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import { TiledMap } from '../model/tiled.map';
import { TiledTile } from '../model/tileset.model';

export default class TileCreator {
    public createTiles(levelSpec: TiledMap, tileProps: { [id: number]: TiledTile }): Matrix<Tile>[] {
        const { layers } = levelSpec;
        return layers.map((layer) => {
            const tiles = new Matrix<Tile>();
            layer.chunks.forEach((chunk) => {
                cross(intRange(0, chunk.width), intRange(0, chunk.height)).forEach(([y, x]) => {
                    const id = chunk.elements[y][x];
                    if (id !== 0) this.setTile(tiles, id, tileProps[id], x + chunk.x, y + chunk.y);
                });
            });
            return tiles;
        });
    }

    private setTile(tiles: Matrix<Tile>, id: number, tile: TiledTile, x: number, y: number): void {
        const tags = [];
        if (this.hasEnabled(tile, 'solid')) {
            tags.push('solid');
        }
        if (this.hasEnabled(tile, 'platform')) {
            tags.push('platform');
        }
        if (this.hasEnabled(tile, 'onlyCrouch')) {
            tags.push('onlyCrouch');
        }
        if (tile && tile.properties.some((t) => t.name === 'other' && t.value.includes('respawn'))) {
            tags.push('respawn');
        }
        tiles.set(x, y, new Tile(id + '', tags));
    }

    hasEnabled(tile: TiledTile, key: string) {
        return tile && tile.properties.some((t) => t.name === key && t.value === true);
    }
}
