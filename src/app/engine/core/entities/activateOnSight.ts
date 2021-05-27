import Entity from './entity';
import { EntityState } from './entity.state';
import Trait, { Context } from './trait';
export default class ActivateOnSight extends Trait {
    constructor() {
        super('activateOnSight');
    }

    update(entity: Entity, context: Context): void {
        const cameraBox = context.camera.box;
        const entityBox = entity.bounds;
        if (cameraBox.right > entityBox.left && cameraBox.left < entityBox.right) {
            entity.state = EntityState.ACTIVE;
        } else {
            entity.state = EntityState.UNTRIGGERED;
        }
    }
}
