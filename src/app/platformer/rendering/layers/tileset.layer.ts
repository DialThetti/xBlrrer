import { debugSettings } from '../../../engine/debug';
import Entity from '../../../engine/entities/entity';
import TraitCtnr from '../../../engine/entities/trait.container';
import Range from '../../../engine/math/range.interface';
import TileColliderLayer from '../../../engine/physics/collider/tile.collider.layer';
import { drawRect } from '../../../engine/rendering/helper';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';
import TileSet from '../../../engine/rendering/tileSet';
import Camera from '../../../engine/world/camera';
import TileMath from '../../../engine/world/tiles/tile.math';
import Level from '../../level';

export default class TilesetLayer implements RenderLayer {
    layers: TileColliderLayer[];
    buffer: HTMLCanvasElement;
    bufferContext: CanvasRenderingContext2D;

    math: TileMath;
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
        this.updateCameraPosition(camera, playerFigure);
        this.redraw(this.toRange(camera.pos.x, camera.size.x), this.toRange(camera.pos.y, camera.size.y));
        context.drawImage(this.buffer, -camera.pos.x % this.level.tilesize, -camera.pos.y % this.level.tilesize);
    }

    private updateCameraPosition(camera: Camera, playerFigure: Entity & TraitCtnr): void {
        const xDif = playerFigure.pos.x - (camera.pos.x + camera.size.x - camera.edge.x - playerFigure.size.x);

        const yDif = playerFigure.pos.y - (camera.pos.y + camera.size.y - camera.edge.y - playerFigure.size.y);

        const xDifMin = playerFigure.pos.x - (camera.pos.x + camera.edge.x);
        const yDifMin = playerFigure.pos.y - (camera.pos.y + camera.edge.y);
        camera.pos.x += Math.max(xDif, 0);
        if (camera.yAllowed) camera.pos.y += Math.max(yDif, 0);

        // if backward is allowed

        camera.pos.x += Math.min(xDifMin, 0);

        if (camera.yAllowed) camera.pos.y += Math.min(yDifMin, 0);

        camera.pos.set(Math.floor(Math.max(camera.pos.x, 0)), Math.floor(Math.max(camera.pos.y, 0)));
    }

    private redraw(rangeX: Range, rangeY: Range): void {
        const currentFrameTileRange = {
            xStart: rangeX.from,
            xEnd: rangeX.to + 1,
            yStart: rangeY.from,
            yEnd: rangeY.to + 1,
        };
        const currentHash = JSON.stringify(currentFrameTileRange);
        if (this.screenFrameTileRangeHash === currentHash) {
            return;
        }

        this.screenFrameTileRangeHash = currentHash;
        this.bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);

        for (const resolver of this.layers) {
            for (let x = currentFrameTileRange.xStart; x < currentFrameTileRange.xEnd + 1; x++) {
                for (let y = currentFrameTileRange.yStart; y < currentFrameTileRange.yEnd + 1; y++) {
                    const match = resolver.getByIndex(x, y);
                    if (!match) {
                        continue;
                    }
                    const tile = match.tile;
                    if (debugSettings.hitboxesOnly) {
                        if (tile.types.includes('solid')) {
                            const s = this.tileSet.tilesize;
                            drawRect(
                                this.bufferContext,
                                s * (x - currentFrameTileRange.xStart),
                                s * (y - currentFrameTileRange.yStart),
                                s,
                                s,
                                'grey',
                                { filled: true },
                            );
                            drawRect(
                                this.bufferContext,
                                s * (x - currentFrameTileRange.xStart),
                                s * (y - currentFrameTileRange.yStart),
                                s,
                                s,
                                'black',
                            );
                        }
                        if (tile.types.includes('platform')) {
                            const s = this.tileSet.tilesize;
                            drawRect(
                                this.bufferContext,
                                s * (x - currentFrameTileRange.xStart),
                                s * (y - currentFrameTileRange.yStart),
                                s,
                                4,
                                'grey',
                                { filled: true },
                            );
                            drawRect(
                                this.bufferContext,
                                s * (x - currentFrameTileRange.xStart),
                                s * (y - currentFrameTileRange.yStart),
                                s,
                                4,
                                'black',
                            );
                        }
                        continue;
                    }
                    if (this.tileSet.isAnimatedTile(tile.name)) {
                        //Animation found for block
                        this.tileSet.drawAnim(
                            tile.name,
                            this.bufferContext,
                            x - currentFrameTileRange.xStart,
                            y - currentFrameTileRange.yStart,
                            this.level.time * 60 /*to frames*/,
                        );
                    } else {
                        this.tileSet.drawTile(
                            tile.name,
                            this.bufferContext,
                            x - currentFrameTileRange.xStart,
                            y - currentFrameTileRange.yStart,
                        );
                    }
                }
            }
        }
    }

    private createBackgroundLayer(extraSize: number): HTMLCanvasElement {
        const buffer = document.createElement('canvas');
        buffer.width = 256 * 2 + extraSize;
        buffer.height = 224 * 2 + extraSize;
        this.screenFrameTileRangeHash = '';

        return buffer;
    }
}
