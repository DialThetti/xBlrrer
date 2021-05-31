import RenderLayer from '@engine/level/rendering/renderLayer';
import { FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect } from 'feather-engine-graphics';

export default class SingleColorLayer implements RenderLayer {
    constructor(private color: string) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, this.color, {
            filled: true,
        });
    }
}
