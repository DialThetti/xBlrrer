import Level from '@engine/level/level';
import { RenderContext } from 'feather-engine-core';

export default interface RenderLayer {
    draw(context: RenderContext, level: Level): void;
}
