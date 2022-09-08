import { BoundingBox, FeatherEngine, RenderContext, Vector } from '@dialthetti/feather-engine-core';
import { Level } from 'src/app/core/level';
import { Camera, SingleColorLayer } from 'src/app/core/rendering';
import { RenderLayer } from 'src/app/core/rendering';
import { ResourceRegistry } from 'src/app/core/resources/resource-registry';
import { Scene, ShowSceneEvent } from 'src/app/core/scenes';
import { SceneNames } from '../scene-names';
import { EngineLayer } from './layer/engine-layer';

export default class EngineScene implements Scene {
  name = SceneNames.engineScene;
  isLoadingScene = false;
  waitTime = 5;
  currentTime = 0;

  private bg: RenderLayer[];
  async load(): Promise<void> {
    const font = await ResourceRegistry.font();
    this.bg = [];
    this.bg.push(new SingleColorLayer('#555b6d'));
    this.bg.push(new EngineLayer(font, () => this.currentTime));
  }

  async start(): Promise<void> {
    // resetting not required here
  }

  update(deltaTime: number): void {
    this.currentTime += deltaTime;
    if (this.currentTime >= this.waitTime) {
      FeatherEngine.eventBus.publish(
        new ShowSceneEvent({ name: SceneNames.mainMenu, withLoading: true, forceLoading: true })
      );
    }
  }
  draw(context: RenderContext): void {
    this.bg.forEach(l =>
      l.draw(context, {
        camera: new Camera(
          new BoundingBox(
            new Vector(0, 0),
            new Vector(FeatherEngine.screenSize.width, FeatherEngine.screenSize.height)
          ),
          new Vector(FeatherEngine.screenSize.width, FeatherEngine.screenSize.height)
        ),
      } as Level)
    );
  }
}
