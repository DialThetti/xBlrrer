import RenderLayer from '@engine/level/rendering/renderLayer';
import { debugSettings } from '../../../engine/core/debug';
import { drawRect } from '../../../engine/core/rendering/helper';
import Camera from '../../../engine/core/world/camera';

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
