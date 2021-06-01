import RenderLayer from '@engine/level/rendering/renderLayer';
import { FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect } from 'feather-engine-graphics';
import Camera from '../../../engine/core/world/camera';

export default class CameraLayer implements RenderLayer {
    constructor(private cameraToDraw: Camera) {}

    draw(context: RenderContext): void {
        if (!FeatherEngine.debugSettings.enabled) {
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
