import Level from '@engine/level/level';
import { RenderContext } from '@dialthetti/feather-engine-core';

export default interface RenderLayer {
    draw(context: RenderContext, level: Level): void;
}
