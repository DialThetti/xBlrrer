import { Matrix } from '@dialthetti/feather-engine-core';
import { FiniteTmxLayer, InfiniteTmxLayer, isFiniteLayer, isInfiniteLayer } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import Tile from '../world/tiles/tile';

export default class TileMatrixCreator {
  booleanTags = ['solid', 'platform', 'onlyCrouch', 'deadly', 'water'];
  constructor(private tileProps: { [id: number]: TsxTileModel }) {}

  public create(layer: InfiniteTmxLayer | FiniteTmxLayer): Matrix<Tile> {
    const tiles = new Matrix<Tile>();
    if (isInfiniteLayer(layer)) {
      this.handleInfiniteLayer(layer, tiles);
    }
    if (isFiniteLayer(layer)) {
      this.handleFiniteLayer(layer, tiles);
    }
    return tiles;
  }
  private handleFiniteLayer(layer: FiniteTmxLayer, tiles: Matrix<Tile>) {
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
  private handleInfiniteLayer(layer: InfiniteTmxLayer, tiles: Matrix<Tile>) {
    layer.chunks.forEach(chunk => {
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

  private setTile(tiles: Matrix<Tile>, id: number, tile: TsxTileModel, x: number, y: number): void {
    const tags = this.booleanTags.filter(tag => this.hasEnabled(tile, tag));

    if (tile && tile.properties.some(t => t.name === 'other' && (t.value as string).includes('respawn'))) {
      tags.push('respawn');
    }
    tiles.set(x, y, new Tile(`${id}`, tags));
  }

  hasEnabled(tile: TsxTileModel, key: string): boolean {
    return tile && tile.properties.some(t => t.name === key && (t.value as boolean) === true);
  }
}
