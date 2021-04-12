import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import { TmxLayer } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';

export default class TileMatrixCreator {
    booleanTags = ['solid', 'platform', 'onlyCrouch'];
    constructor(private tileProps: { [id: number]: TsxTileModel }) {}

    public create(layer: TmxLayer): Matrix<Tile> {
        const tiles = new Matrix<Tile>();
        layer.chunks.forEach((chunk) => {
            for (let x = 0; x < chunk.width; x++) {
                for (let y = 0; y < chunk.height; y++) {
                    const id = chunk.data[y * chunk.width + x];
                    if (id === 0) {
                        continue;
                    }
                    this.setTile(tiles, id, this.tileProps[id], x + chunk.x, y + chunk.y);
                }
            }
        });
        return tiles;
    }

    private setTile(tiles: Matrix<Tile>, id: number, tile: TsxTileModel, x: number, y: number): void {
        const tags = this.booleanTags.filter((tag) => this.hasEnabled(tile, tag));

        if (tile && tile.properties.some((t) => t.name === 'other' && (t.value as string).includes('respawn'))) {
            tags.push('respawn');
        }
        tiles.set(x, y, new Tile(`${id}`, tags));
    }

    hasEnabled(tile: TsxTileModel, key: string) {
        return tile && tile.properties.some((t) => t.name === key && (t.value as boolean) === true);
    }
}
