import Tile from '@engine/core/world/tiles/tile';
import TileMath from '@engine/core/world/tiles/tile.math';
import * as EngineLevel from '@engine/level/level';
import LevelLayer from '@engine/level/level-layer';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { Canvas, CanvasRenderer, FeatherEngine, Range, RenderContext } from 'feather-engine-core';
import { drawRect, TileSet } from 'feather-engine-graphics';
import PlatformerLevel from '../../level';

export default class TilesetLayer implements RenderLayer {
    private buffer: Canvas;
    private bufferContext: RenderContext;

    private math: TileMath;
    screenFrameTileRangeHash: string;

    constructor(private level: PlatformerLevel, private tileSet: TileSet, onlyFront = false) {
        this.createBackgroundLayer(level.tilesize);

        this.math = new TileMath(level.tilesize);
    }

    private toRange(pos: number, size: number): Range {
        const bWidth = this.math.toIndex(size);
        const from = this.math.toIndex(pos);
        return { from, to: bWidth + from };
    }

    draw(context: RenderContext, level: EngineLevel.default): void {
        this.redraw(
            level,
            this.toRange(level.camera.box.left, level.camera.size.x),
            this.toRange(level.camera.box.top, level.camera.size.y),
        );
        context.drawImage(
            this.buffer,
            -level.camera.box.left % this.level.tilesize,
            -level.camera.box.top % this.level.tilesize,
        );
    }

    private redraw(level: EngineLevel.default, rangeX: Range, rangeY: Range): void {
        if (!this.hasChanged(rangeX, rangeY)) {
            return;
        }
        this.bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        level.levelLayer.forEach((layer) => this.renderLayer(layer, rangeX, rangeY));
    }

    private hasChanged(rangeX: Range, rangeY: Range): boolean {
        const currentHash = JSON.stringify({ rangeX, rangeY });
        if (this.screenFrameTileRangeHash === currentHash) {
            //     return false;
        }
        this.screenFrameTileRangeHash = currentHash;
        return true;
    }

    private renderLayer(layer: LevelLayer, rangeX: Range, rangeY: Range): void {
        for (let x = rangeX.from; x <= rangeX.to; x++) {
            for (let y = rangeY.from; y <= rangeY.to; y++) {
                const match = layer.getByIndex(x, y);
                if (!match) {
                    continue;
                }
                if (FeatherEngine.debugSettings.hitboxesOnly) {
                    this.renderHitbox(match.tile, x - rangeX.from, y - rangeY.from);
                } else {
                    this.renderTile(match.tile, x - rangeX.from, y - rangeY.from);
                }
            }
        }
    }
    renderTile(tile: Tile, x: number, y: number): void {
        if (this.tileSet.isAnimatedTile(tile.name)) {
            //Animation found for block
            this.tileSet.drawAnim(tile.name, this.bufferContext, x, y, this.level.time);
        } else {
            this.tileSet.drawTile(tile.name, this.bufferContext, x, y);
        }
    }

    renderHitbox(tile: Tile, x: number, y: number): void {
        const s = this.tileSet.tilesize;
        if (tile.types.includes('solid')) {
            drawRect(this.bufferContext, s * x, s * y, s, s, 'grey', {
                filled: true,
            });
            drawRect(this.bufferContext, s * x, s * y, s, s, 'black');
        }
        if (tile.types.includes('platform')) {
            drawRect(this.bufferContext, s * x, s * y, s, 4, 'grey', {
                filled: true,
            });
            drawRect(this.bufferContext, s * x, s * y, s, 4, 'black');
        }
    }

    createBackgroundLayer(extraSize: number): void {
        this.bufferContext = CanvasRenderer.createRenderContext(256 * 2 + extraSize, 224 * 2 + extraSize);
        this.buffer = this.bufferContext.canvas;
        this.screenFrameTileRangeHash = '';
    }
}
