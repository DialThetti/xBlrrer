import { RenderContext } from '@engine/core/rendering/render.utils';
import Level from '@engine/level/level';

export default interface RenderLayer {
    draw(context: RenderContext, level: Level): void;
}
