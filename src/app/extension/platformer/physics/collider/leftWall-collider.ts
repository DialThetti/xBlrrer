import { Entity, TraitCtnr } from 'feather-engine-entities';
import CantGoLeft from '../../entities/traits/cantGoLeft';

export default class LeftWallCollider {
    check(entity: Entity & TraitCtnr): void {
        if (entity.vel.x === 0) {
            return;
        }
        if (entity.hasTrait(CantGoLeft)) {
            const cantGoLeft = entity.getTrait(CantGoLeft);
            if (cantGoLeft.posOnScreen.x <= 0) {
                entity.pos.x -= cantGoLeft.posOnScreen.x;
            }
        }
    }
}
