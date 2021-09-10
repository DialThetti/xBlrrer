import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { Canvas, CanvasRenderer, RenderContext } from 'feather-engine-core';
import { Entity } from 'feather-engine-entities';

export default class EntityLayer implements RenderLayer {
    bufferContext: RenderContext;
    buffer: Canvas;
    constructor(private entities: Set<Entity>, private width = 64, private height = 64) {
        this.createBuffer(width, height);
    }

    draw(context: RenderContext, level: Level): void {
        const { camera } = level;
        [...this.entities]
            .filter((entity) => entity.bounds.overlaps(camera.box))
            .forEach((entity) => {
                this.bufferContext.clearRect(0, 0, this.width, this.height);
                entity.draw(this.bufferContext);
                context.drawImage(
                    this.buffer,
                    Math.floor(entity.pos.x - camera.box.left),
                    Math.floor(entity.pos.y - camera.box.top),
                );
            });
    }

    createBuffer(width: number, height: number): void {
        this.bufferContext = CanvasRenderer.createRenderContext(width, height);
        this.buffer = this.bufferContext.canvas;
    }
}
