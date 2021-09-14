import { FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect, Font } from '@dialthetti/feather-engine-graphics';
import PlatformerLevel from '@extension/platformer/level/level';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';

export default class DashboardLayer implements RenderLayer {
    constructor(private font: Font, private level: PlatformerLevel) {}

    draw(context: RenderContext): void {
        drawRect(
            context,
            0,
            23 * this.level.tilesize,
            FeatherEngine.screenSize.width,
            5 * this.level.tilesize,
            'black',
            {
                filled: true,
            },
        );
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
