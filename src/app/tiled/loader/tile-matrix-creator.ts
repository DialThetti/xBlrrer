import Matrix from '../../engine/math/matrix';
import Tile from '../../engine/world/tiles/tile';
import { FiniteTmxLayer, InfiniteTmxLayer, isFiniteLayer, isInfiniteLayer } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';

export default class TileMatrixCreator {
    booleanTags = ['solid', 'platform', 'onlyCrouch'];
    constructor(private tileProps: { [id: number]: TsxTileModel }) {}

    public create(layer: InfiniteTmxLayer | FiniteTmxLayer): Matrix<Tile> {
        const tiles = new Matrix<Tile>();
        if (isInfiniteLayer(layer)) {
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
        }
        if (isFiniteLayer(layer)) {
            for (let x = 0; x < layer.width; x++) {
                for (let y = 0; y < layer.height; y++) {
                    const id = layer.data[y * layer.width + x];

                    if (id === 0) {
                        continue;
                    }
                    this.setTile(tiles, id, this.tileProps[id], x + layer.x, y + layer.y);
                }
            }
        }
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
