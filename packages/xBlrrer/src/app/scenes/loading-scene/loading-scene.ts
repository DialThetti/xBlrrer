import { BoundingBox, FeatherEngine, RenderContext, Vector } from '@dialthetti/feather-engine-core';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import LoadingPrefab from '@game/entities/prefabs/loading-prefab';
import { Level } from 'src/app/core/level';
import { Camera, EntityLayer, SingleColorLayer } from 'src/app/core/rendering';
import { RenderLayer } from 'src/app/core/rendering';
import { Scene } from 'src/app/core/scenes';
import { SceneNames } from '../scene-names';

export default class LoadingScene implements Scene {
  name = SceneNames.loadingScene;
  isLoadingScene = true;

  private bg: RenderLayer[];
  private loadingAnimation: PlatformerEntity;
  async load(): Promise<void> {
    this.bg = [];
    this.bg.push(new SingleColorLayer('#555b6d'));
    this.loadingAnimation = (await new LoadingPrefab().create())() as PlatformerEntity;
    this.loadingAnimation.pos.set(256 * 2 - 64, 244 * 2 - 96);
    const entities = new Set<PlatformerEntity>();
    entities.add(this.loadingAnimation);
    this.bg.push(new EntityLayer(entities));
  }

  async start(): Promise<void> {
    // resetting not required here
  }

  update(deltaTime: number): void {
    this.loadingAnimation.lifeTime += deltaTime;
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
