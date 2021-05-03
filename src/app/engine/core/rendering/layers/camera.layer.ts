import { debugSettings } from '../../debug';
import Camera from '../../world/camera';
import { drawRect } from '../helper';
import RenderLayer from './renderLayer';

export default class CameraLayer implements RenderLayer {
    constructor(private cameraToDraw: Camera) {}

    draw(context: CanvasRenderingContext2D): void {
        if (!debugSettings.enabled) {
            return;
        }
        drawRect(
            context,
            this.cameraToDraw.box.left,
            this.cameraToDraw.box.top,
            this.cameraToDraw.size.x,
            this.cameraToDraw.size.y,
            'purple',
        );
    }
}
