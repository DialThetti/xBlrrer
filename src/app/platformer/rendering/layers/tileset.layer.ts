import { debugSettings } from '../../../engine/debug';
import Entity from '../../../engine/entities/entity';
import TraitCtnr from '../../../engine/entities/trait.container';
import Range from '../../../engine/math/range.interface';
import TileColliderLayer from '../../../engine/physics/collider/tile.collider.layer';
import { drawRect } from '../../../engine/rendering/helper';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';
import { Canvas, createCanvas, RenderContext } from '../../../engine/rendering/render.utils';
import TileSet from '../../../engine/rendering/tileSet';
import Camera from '../../../engine/world/camera';
import Tile from '../../../engine/world/tiles/tile';
import TileMath from '../../../engine/world/tiles/tile.math';
import Level from '../../level';

export default class TilesetLayer implements RenderLayer {
    layers: TileColliderLayer[];
    private buffer: Canvas;
    private bufferContext: RenderContext;

    private math: TileMath;
    screenFrameTileRangeHash: string;

    constructor(private level: Level, private tileSet: TileSet) {
        this.layers = level.collider.tileCollider.layers;
        this.buffer = this.createBackgroundLayer(level.tilesize);
        this.bufferContext = this.buffer.getContext('2d');
        this.math = new TileMath(level.tilesize);
    }

    private toRange(pos: number, size: number): Range {
        const bWidth = this.math.toIndex(size);
        const from = this.math.toIndex(pos);
        return { from, to: bWidth + from };
    }

    draw(context: CanvasRenderingContext2D, camera: Camera, playerFigure: Entity & TraitCtnr): void {
        this.redraw(this.toRange(camera.box.left, camera.size.x), this.toRange(camera.box.top, camera.size.y));
        context.drawImage(this.buffer, -camera.box.left % this.level.tilesize, -camera.box.top % this.level.tilesize);
    }

    private redraw(rangeX: Range, rangeY: Range): void {
        if (!this.hasChanged(rangeX, rangeY)) {
            return;
        }
        this.bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this.layers.forEach((layer) => this.renderLayer(layer, rangeX, rangeY));
    }

    private hasChanged(rangeX: Range, rangeY: Range): boolean {
        const currentHash = JSON.stringify({ rangeX, rangeY });
        if (this.screenFrameTileRangeHash === currentHash) {
            return false;
        }
        this.screenFrameTileRangeHash = currentHash;
        return true;
    }

    private renderLayer(layer: TileColliderLayer, rangeX: Range, rangeY: Range): void {
        for (let x = rangeX.from; x <= rangeX.to; x++) {
            for (let y = rangeY.from; y <= rangeY.to; y++) {
                const match = layer.getByIndex(x, y);
                if (!match) {
                    continue;
                }
                if (debugSettings.hitboxesOnly) {
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
            this.tileSet.drawAnim(tile.name, this.bufferContext, x, y, this.level.time * 60 /*to frames*/);
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

    createBackgroundLayer(extraSize: number): Canvas {
        const buffer = createCanvas(256 * 2 + extraSize, 224 * 2 + extraSize);
        this.screenFrameTileRangeHash = '';
        return buffer;
    }
}
