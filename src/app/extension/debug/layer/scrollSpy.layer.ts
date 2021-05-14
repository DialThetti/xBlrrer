import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { debugSettings } from '../../../engine/core/debug';
import { drawRect } from '../../../engine/core/rendering/helper';

export default class ScrollSpyLayer implements RenderLayer {
    draw(context: CanvasRenderingContext2D, level: Level): void {
        if (!debugSettings.enabled) {
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
