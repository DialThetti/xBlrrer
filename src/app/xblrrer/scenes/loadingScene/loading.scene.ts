import Entity from '../../../engine/entities/entity';
import Compositor from '../../../engine/rendering/compositor.layer';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';
import SingleColorLayer from '../../../engine/rendering/layers/singleColor.layer';
import SpriteLayer from '../../../engine/rendering/layers/sprite.layer';
import Camera from '../../../engine/world/camera';
import Scene from '../../../scenes/scene';
import EntityImpl from '../../entities/entity';
import LoadingPrefab from '../../entities/prefabs/Loading.prefab';

export default class LoadingScene implements Scene {
    name = 'loadingScene';
    isLoadingScene = true;

    private bg: Compositor;
    private loadingAnimation: EntityImpl;
    async load(): Promise<void> {
        this.bg = new Compositor();
        this.bg.layers.push(new SingleColorLayer('#555b6d'));
        this.loadingAnimation = (await new LoadingPrefab().create())() as EntityImpl;
        this.loadingAnimation.pos.set(256 * 2 - 64, 244 * 2 - 96);
        const entities = new Set<EntityImpl>();
        entities.add(this.loadingAnimation);
        this.bg.layers.push(new SpriteLayer(entities));
    }

    async start(): Promise<void> {}
    update(deltaTime: number): void {
        this.loadingAnimation.lifeTime += deltaTime;
    }
    draw(context: CanvasRenderingContext2D, deltaTime: number): void {
        this.bg.draw(context, new Camera(), null);
    }
}
