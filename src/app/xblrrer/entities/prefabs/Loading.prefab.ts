import EntityPrefab from '../../../engine/entities/entity.prefab';
import Trait from '../../../engine/entities/trait';
import Vector from '../../../engine/math/vector';
import SpriteSheet from '../../../engine/rendering/spriteSheet';
import EntityImpl from '../../../platformer/entities/entity';

export default class LoadingPrefab extends EntityPrefab {
    constructor() {
        super('loading', 'loading');
        this.size = new Vector(32, 32);
        this.offset = new Vector(0, 0);
        this.traits = (): Trait[] => [];
    }
    entityFac = (): EntityImpl => new EntityImpl();

    routeFrame(entity: EntityImpl, sprite: SpriteSheet): string {
        return sprite.getAnimation('loading')(entity.lifeTime * 60);
    }
}
