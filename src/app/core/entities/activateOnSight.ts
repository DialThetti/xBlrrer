import { Entity, EntityState } from '@dialthetti/feather-engine-entities';
import TraitAdapter, { Context } from './trait';
export default class ActivateOnSight extends TraitAdapter {
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
