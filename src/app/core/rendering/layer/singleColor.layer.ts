import { FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect } from '@dialthetti/feather-engine-graphics';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';

export default class SingleColorLayer implements RenderLayer {
    constructor(private color: string) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, this.color, {
            filled: true,
        });
    }
}
