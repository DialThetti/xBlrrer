import Camera from '../../world/camera';
import Entity from '../../entities/entity';
import RenderLayer from './renderLayer';

export default class SpriteLayer implements RenderLayer {
    bufferContext: CanvasRenderingContext2D;
    buffer: HTMLCanvasElement;
    constructor(private entities: Set<Entity>, private width = 64, private height = 64) {
        this.buffer = document.createElement('canvas');
        this.buffer.width = width;
        this.buffer.height = height;
        this.bufferContext = this.buffer.getContext('2d');
    }

    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        [...this.entities]
            .filter(entity => entity.bounds.overlaps(camera.box))
            .forEach(entity => {
                this.bufferContext.clearRect(0, 0, this.width, this.height);
                entity.draw(this.bufferContext);
                context.drawImage(
                    this.buffer,
                    Math.floor(entity.pos.x - camera.pos.x),
                    Math.floor(entity.pos.y - camera.pos.y),
                );
            });
    }
}
