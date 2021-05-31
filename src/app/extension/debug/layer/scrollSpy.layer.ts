import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect } from 'feather-engine-graphics';

export default class ScrollSpyLayer implements RenderLayer {
    draw(context: RenderContext, level: Level): void {
        if (!FeatherEngine.debugSettings.enabled) {
            return;
        }
        drawRect(
            context,
            level.camera.edge.x,
            level.camera.edge.y,
            level.camera.size.x - level.camera.edge.x * 2,
            level.camera.size.y - level.camera.edge.y * 2,
            'green',
        );
    }
}