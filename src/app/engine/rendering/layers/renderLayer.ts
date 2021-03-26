import Entity from '../../entities/entity';
import Camera from '../../world/camera';

export default interface RenderLayer {
    draw(context: CanvasRenderingContext2D, camera: Camera, e: Entity): void;
}
