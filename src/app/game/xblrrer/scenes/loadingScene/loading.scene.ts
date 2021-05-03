import BoundingBox from '@engine/core/math/boundingBox';
import Vector from '@engine/core/math/vector';
import Compositor from '@engine/core/rendering/compositor.layer';
import SpriteLayer from '@engine/core/rendering/layers/entity.layer';
import SingleColorLayer from '@engine/core/rendering/layers/singleColor.layer';
import { SCREEN_SIZE } from '@engine/core/screen.settings';
import Camera from '@engine/core/world/camera';
import Scene from '@engine/scenes/scene';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import LoadingPrefab from '@game/xblrrer/entities/prefabs/Loading.prefab';

export default class LoadingScene implements Scene {
    name = 'loadingScene';
    isLoadingScene = true;

    private bg: Compositor;
    private loadingAnimation: PlatformerEntity;
    async load(): Promise<void> {
        this.bg = new Compositor();
        this.bg.layers.push(new SingleColorLayer('#555b6d'));
        this.loadingAnimation = (await new LoadingPrefab().create())() as PlatformerEntity;
        this.loadingAnimation.pos.set(256 * 2 - 64, 244 * 2 - 96);
        const entities = new Set<PlatformerEntity>();
        entities.add(this.loadingAnimation);
        this.bg.layers.push(new SpriteLayer(entities));
    }

    async start(): Promise<void> {
        // resetting not required here
    }

    update(deltaTime: number): void {
        this.loadingAnimation.lifeTime += deltaTime;
    }
    draw(context: CanvasRenderingContext2D): void {
        this.bg.draw(
            context,
            new Camera(
                new BoundingBox(new Vector(0, 0), new Vector(SCREEN_SIZE.width, SCREEN_SIZE.height)),
                new Vector(SCREEN_SIZE.width, SCREEN_SIZE.height),
            ),
            null,
        );
    }
}
