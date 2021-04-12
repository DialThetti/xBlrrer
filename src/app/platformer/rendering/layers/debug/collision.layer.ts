import { debug } from '../../../../engine/debug';
import TileCollider from '../../../../engine/physics/collider/tile.collider';
import { PositionedTile } from '../../../../engine/physics/collider/tile.collider.layer';
import { drawRect } from '../../../../engine/rendering/helper';
import RenderLayer from '../../../../engine/rendering/layers/renderLayer';
import Camera from '../../../../engine/world/camera';
import Level from '../../../level';

export default class CollisionLayer implements RenderLayer {
    tileSize: number;
    tileCollider: TileCollider;
    resolvedTiles: { x: number; y: number }[] = [];
    constructor(private level: Level) {
        this.resolvedTiles = [];
        this.tileCollider = level.collider.tileCollider;
        this.tileSize = level.tilesize;

        const getByIndexOrigin = this.tileCollider.layers[0].getByIndex;

        this.tileCollider.layers[0].getByIndex = (x: number, y: number): PositionedTile => {
            if (debugSettings.enabled) {
                this.resolvedTiles.push({ x, y });
                if (this.resolvedTiles.length > 100) {
                    debugger;
                }
            }
            return getByIndexOrigin.call(this.tileCollider.layers[0], x, y);
        };
    }

    drawEntityFrames(context: CanvasRenderingContext2D, camera: Camera): void {
        this.level.entities.forEach((entity) =>
            drawRect(
                context,
                entity.bounds.left - camera.pos.x,
                entity.bounds.top - camera.pos.y,
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
                x * this.tileSize - camera.pos.x,
                y * this.tileSize - camera.pos.y,
                this.tileSize,
                this.tileSize,
                'blue',
            ),
        );
    }
    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        if (!debug) {
            return;
        }
        this.drawTileFrames(context, camera);
        this.drawEntityFrames(context, camera);
        this.resolvedTiles.length = 0;
    }
}
