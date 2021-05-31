import RenderLayer from '@engine/level/rendering/renderLayer';
import { RenderContext } from 'feather-engine-core';
import { drawRect } from 'feather-engine-graphics';
import { debugSettings } from '../../../engine/core/debug';
import Camera from '../../../engine/core/world/camera';

export default class CameraLayer implements RenderLayer {
    constructor(private cameraToDraw: Camera) {}

    draw(context: RenderContext): void {
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
