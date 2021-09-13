import Tile from '@engine/core/world/tiles/tile';
import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { Canvas, CanvasRenderer, Matrix, RenderContext } from '@dialthetti/feather-engine-core';
import { TileSet } from '@dialthetti/feather-engine-graphics';

export default class TilesetLayer implements RenderLayer {
    private buffer: RenderContext;
    constructor(
        private tiles: Matrix<Tile>[],
        private tileset: TileSet,
        private time: () => number,
        private chunkSize = 32,
    ) {
        this.buffer = CanvasRenderer.createRenderContext(
            this.chunkSize * this.tileset.tilesize,
            this.chunkSize * this.tileset.tilesize,
        );
    }
    draw(context: RenderContext, level: Level): void {
        const { camera } = level;
        const xRange = { from: this.toChunkPosition(camera.box.left), to: this.toChunkPosition(camera.box.right) + 1 };
        const yRange = { from: this.toChunkPosition(camera.box.top), to: this.toChunkPosition(camera.box.bottom) + 1 };
        for (let x = xRange.from; x < xRange.to; x++) {
            for (let y = yRange.from; y < yRange.to; y++) {
                context.drawImage(
                    this.prepareChunk(x, y),
                    x * this.tileset.tilesize * this.chunkSize - camera.box.left,
                    y * this.tileset.tilesize * this.chunkSize - camera.box.top,
                );
            }
        }
    }

    prepareChunk(x: number, y: number): Canvas {
        const context = this.buffer;
        context.clearRect(0, 0, this.chunkSize * this.tileset.tilesize, this.chunkSize * this.tileset.tilesize);
        const chunk = context.canvas;
        const xRange = { from: x * this.chunkSize, to: (x + 1) * this.chunkSize };
        const yRange = { from: y * this.chunkSize, to: (y + 1) * this.chunkSize };

        this.tiles.forEach((layer) => {
            for (let x = xRange.from; x < xRange.to; x++) {
                for (let y = yRange.from; y < yRange.to; y++) {
                    const tile = layer.get(x, y);
                    if (tile) {
                        if (this.tileset.isAnimatedTile(tile.name)) {
                            this.tileset.drawAnim(tile.name, context, x - xRange.from, y - yRange.from, this.time());
                        } else {
                            this.tileset.drawTile(tile.name, context, x - xRange.from, y - yRange.from);
                        }
                    }
                }
            }
        });
        return chunk;
    }
    private toChunkPosition(x: number): number {
        return Math.floor(x / this.tileset.tilesize / this.chunkSize);
    }
}
