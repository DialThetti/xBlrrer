import Entity from './entity';
import { EntityState } from './entity.state';
import Trait, { Context } from './trait';

export default class ActivateOnSight extends Trait {
    constructor() {
        super('activateOnSight');
    }

    update(entity: Entity, context: Context): void {
        if (context.camera.box.right > entity.bounds.left && context.camera.box.left < entity.bounds.right) {
            entity.state = EntityState.ACTIVE;
        } else {
            entity.state = EntityState.UNTRIGGERED;
        }
    }
}
