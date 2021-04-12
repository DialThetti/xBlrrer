import EntityPrefab from '../../../engine/entities/entity.prefab';
import Trait from '../../../engine/entities/trait';
import Vector from '../../../engine/math/vector';
import SpriteSheet from '../../../engine/rendering/spriteSheet';
import PlatformerEntity from '../../../platformer/entities/platformer-entity';

export default class LoadingPrefab extends EntityPrefab {
    constructor() {
        super('loading', 'loading');
        this.size = new Vector(32, 32);
        this.offset = new Vector(0, 0);
        this.traits = (): Trait[] => [];
    }
    entityFac = (): PlatformerEntity => new PlatformerEntity();

    routeFrame(entity: PlatformerEntity, sprite: SpriteSheet): string {
        return sprite.getAnimation('loading')(entity.lifeTime * 60);
    }
}
