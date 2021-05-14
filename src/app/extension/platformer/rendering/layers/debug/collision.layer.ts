import { debugSettings } from '@engine/core/debug';
import TileCollider from '@engine/core/physics/collider/tile.collider';
import { drawRect } from '@engine/core/rendering/helper';
import Camera from '@engine/core/world/camera';
import * as EngineLevel from '@engine/level/level';
import { PositionedTile } from '@engine/level/level-layer';
import RenderLayer from '@engine/level/rendering/renderLayer';
import PlatformerLevel from '../../../level';
export default class CollisionLayer implements RenderLayer {
    tileSize: number;
    tileCollider: TileCollider;
    resolvedTiles: { x: number; y: number }[] = [];
    constructor(private level: PlatformerLevel) {
        this.resolvedTiles = [];
        this.tileCollider = level.collider.tileCollider;
        this.tileSize = level.tilesize;
        const getByIndexOrigin = level.levelLayer[0].getByIndex;

        level.levelLayer[0].getByIndex = (x: number, y: number): PositionedTile => {
            if (debugSettings.enabled) {
                this.resolvedTiles.push({ x, y });
            }
            return getByIndexOrigin.call(level.levelLayer[0], x, y);
        };
    }

    drawEntityFrames(context: CanvasRenderingContext2D, camera: Camera): void {
        this.level.entities.forEach((entity) =>
            drawRect(
                context,
                entity.bounds.left - camera.box.left,
                entity.bounds.top - camera.box.top,
                entity.size.x,
                entity.size.y,
                'red',
            ),
        );
    }
    drawTileFrames(context: CanvasRenderingContext2D, camera: Camera): void {
        this.resolvedTiles.forEach(({ x, y }) =>
            drawRect(
                context,
                x * this.tileSize - camera.box.left,
                y * this.tileSize - camera.box.top,
                this.tileSize,
                this.tileSize,
                'blue',
            ),
        );
    }
    draw(context: CanvasRenderingContext2D, level: EngineLevel.default): void {
        if (!debugSettings.enabled) {
            return;
        }
        this.drawTileFrames(context, level.camera);
        this.drawEntityFrames(context, level.camera);
        this.resolvedTiles.length = 0;
    }
}
