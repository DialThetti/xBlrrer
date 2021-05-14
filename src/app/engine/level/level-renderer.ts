import { RenderContext } from '@engine/core/rendering/render.utils';
import Level from './level';
import RenderLayer from './rendering/renderLayer';

class LevelRenderer {
    private layers: RenderLayer[] = [];

    public render(context: RenderContext, level: Level): void {
        this.layers.forEach((layer) => layer.draw(context, level));
    }

    public addLayer(layer: RenderLayer): void {
        this.layers.push(layer);
    }
}

export const LEVEL_RENDERER = new LevelRenderer();
