import { Canvas, CanvasRenderer, Matrix, RenderContext } from '@dialthetti/feather-engine-core';
import { TileSet } from '@dialthetti/feather-engine-graphics';
import { Tile } from '@dialthetti/feather-engine-tiled';
import { Level } from 'src/app/core/level';
import { RenderLayer } from 'src/app/core/rendering';

export default class ChunkedTilesetLayer implements RenderLayer {
    private chunks: Matrix<Canvas> = new Matrix();
    constructor(private tiles: Matrix<Tile>[], private tileset: TileSet, private chunkSize: number = 32) { }
    draw(context: RenderContext, level: Level): void {
        const { camera } = level;
        const xRange = { from: this.toChunkPosition(camera.box.left), to: this.toChunkPosition(camera.box.right) + 1 };
        const yRange = { from: this.toChunkPosition(camera.box.top), to: this.toChunkPosition(camera.box.bottom) + 1 };
        for (let x = xRange.from; x < xRange.to; x++) {
            for (let y = yRange.from; y < yRange.to; y++) {
                if (!this.chunks.get(x, y)) {
                    this.prepareChunk(x, y);
                }
                context.drawImage(
                    this.chunks.get(x, y),
                    x * this.tileset.tilesize * this.chunkSize - camera.box.left,
                    y * this.tileset.tilesize * this.chunkSize - camera.box.top,
                );
            }
        }
    }

    prepareChunk(x: number, y: number): void {
        const context = CanvasRenderer.createRenderContext(
            this.chunkSize * this.tileset.tilesize,
            this.chunkSize * this.tileset.tilesize,
        );
        const chunk = context.canvas;
        const xRange = { from: x * this.chunkSize, to: (x + 1) * this.chunkSize };
        const yRange = { from: y * this.chunkSize, to: (y + 1) * this.chunkSize };

        this.tiles.forEach((layer) => {
            for (let relX = xRange.from; relX < xRange.to; relX++) {
                for (let relY = yRange.from; relY < yRange.to; relY++) {
                    const tile = layer.get(relX, relY);
                    if (tile) {
                        this.tileset.drawTile(tile.name, context, relX - xRange.from, relY - yRange.from);
                    }
                }
            }
        });
        this.chunks.set(x, y, chunk);
    }
    private toChunkPosition(x: number): number {
        return Math.floor(x / this.tileset.tilesize / this.chunkSize);
    }
}
