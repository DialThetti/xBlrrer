import { RenderContext } from '@dialthetti/feather-engine-core';
import Level from 'src/app/core/level/level';

export default interface RenderLayer {
    draw(context: RenderContext, level: Level): void;
}
