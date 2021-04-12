import Entity from '../../entities/entity';
import Camera from '../../world/camera';
import { Canvas, createCanvas, RenderContext } from '../render.utils';
import RenderLayer from './renderLayer';

export default class EntityLayer implements RenderLayer {
    bufferContext: RenderContext;
    buffer: Canvas;
    constructor(private entities: Set<Entity>, private width = 64, private height = 64) {
        this.createBuffer(width, height);
    }

    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        [...this.entities]
            .filter((entity) => entity.bounds.overlaps(camera.box))
            .forEach((entity) => {
                this.bufferContext.clearRect(0, 0, this.width, this.height);
                entity.draw(this.bufferContext);
                context.drawImage(
                    this.buffer,
                    Math.floor(entity.pos.x - camera.pos.x),
                    Math.floor(entity.pos.y - camera.pos.y),
                );
            });
    }

    createBuffer(width: number, height: number): void {
        this.buffer = createCanvas(width, height);
        this.bufferContext = this.buffer.getContext('2d');
    }
}
