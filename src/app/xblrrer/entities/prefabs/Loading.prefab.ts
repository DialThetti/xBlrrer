import Vector from '../../../engine/math/vector';
import SpriteSheet from '../../../engine/rendering/spriteSheet';
import EntityImpl from '../entity';
import Walk from '../traits/walk.ai';
import Killable from '../traits/killable';
import Trait from '../../../engine/entities/trait';
import EntityPrefab from '../../../engine/entities/entity.prefab';
import Solid from '../../../engine/physics/traits/solid';
import Gravity from '../../../engine/physics/traits/gravity';
import { getTraits } from '../traits';
import Physics from '../../../engine/physics/traits/physics';
import ActivateOnSight from '../../../engine/entities/activateOnSight';

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
