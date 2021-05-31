import { drawRect } from '@engine/core/rendering/helper';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { FeatherEngine, RenderContext } from 'feather-engine-core';

export default class SingleColorLayer implements RenderLayer {
    constructor(private color: string) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, this.color, {
            filled: true,
        });
    }
}
