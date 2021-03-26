import { debug } from '../../debug';
import Camera from '../../world/camera';
import { drawRect } from '../helper';
import RenderLayer from './renderLayer';

export default class CameraLayer implements RenderLayer {
    constructor(private cameraToDraw: Camera) {}

    draw(context: CanvasRenderingContext2D, fromCamera: Camera): void {
        if (!debug) {
            return;
        }
        drawRect(
            context,
            this.cameraToDraw.pos.x - fromCamera.pos.x,
            this.cameraToDraw.pos.y - fromCamera.pos.y,
            this.cameraToDraw.size.x,
            this.cameraToDraw.size.y,
            'purple',
        );
    }
}
