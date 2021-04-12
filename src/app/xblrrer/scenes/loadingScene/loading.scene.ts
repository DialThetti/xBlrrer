import Compositor from '../../../engine/rendering/compositor.layer';
import SpriteLayer from '../../../engine/rendering/layers/entity.layer';
import SingleColorLayer from '../../../engine/rendering/layers/singleColor.layer';
import Camera from '../../../engine/world/camera';
import PlatformerEntity from '../../../platformer/entities/platformer-entity';
import Scene from '../../../scenes/scene';
import LoadingPrefab from '../../entities/prefabs/Loading.prefab';

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
        this.bg.draw(context, new Camera(), null);
    }
}
