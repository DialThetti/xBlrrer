import { RenderContext } from '@dialthetti/feather-engine-core';
import RenderLayer from '../rendering/layer/renderLayer';
import Level from './level';

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
