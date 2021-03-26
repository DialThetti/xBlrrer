import Entity from '../entities/entity';
import Camera from '../world/camera';
import RenderLayer from './layers/renderLayer';

export default class Compositor implements RenderLayer {
    layers: RenderLayer[] = [];

    draw(context: CanvasRenderingContext2D, camera: Camera, e: Entity): void {
        this.layers.forEach(layer => layer.draw(context, camera, e));
    }
}
