import { FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect } from '@dialthetti/feather-engine-graphics';
import Level from 'src/app/core/level/level';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';

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
