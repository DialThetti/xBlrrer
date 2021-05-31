import Camera from '@engine/core/world/camera';
import Level from '@engine/level/level';
import EntityLayer from '@engine/level/rendering/entity.layer';
import RenderLayer from '@engine/level/rendering/renderLayer';
import SingleColorLayer from '@engine/level/rendering/singleColor.layer';
import Scene from '@engine/scenes/scene';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import LoadingPrefab from '@game/xblrrer/entities/prefabs/Loading.prefab';
import { BoundingBox, FeatherEngine, RenderContext, Vector } from 'feather-engine-core';

export default class LoadingScene implements Scene {
    name = 'loadingScene';
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
        this.bg.forEach((l) =>
            l.draw(context, {
                camera: new Camera(
                    new BoundingBox(
                        new Vector(0, 0),
                        new Vector(FeatherEngine.screenSize.width, FeatherEngine.screenSize.height),
                    ),
                    new Vector(FeatherEngine.screenSize.width, FeatherEngine.screenSize.height),
                ),
            } as Level),
        );
    }
}
