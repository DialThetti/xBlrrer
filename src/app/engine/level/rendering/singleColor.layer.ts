import { drawRect } from '@engine/core/rendering/helper';
import { SCREEN_SIZE } from '@engine/core/screen.settings';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { RenderContext } from 'feather-engine-core';

export default class SingleColorLayer implements RenderLayer {
    constructor(private color: string) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, SCREEN_SIZE.width, SCREEN_SIZE.height, this.color, { filled: true });
    }
}
