import { RenderContext } from '@dialthetti/feather-engine-core';
import { Level } from 'src/app/core/level';

export interface RenderLayer {
    draw(context: RenderContext, level: Level): void;
}
