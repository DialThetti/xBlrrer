import { LEVEL_COLLIDER } from '@engine/level/level-collider';
import { Entity } from '@dialthetti/feather-engine-entities';
import ATrait, { Context } from '../../entities/trait';

export default class Physics extends ATrait {
    constructor() {
        super('physics');
    }

    update(e: Entity, context: Context): void {
        if (!this.enabled) {
            return;
        }
        e.pos.x += e.vel.x * context.deltaTime;
        LEVEL_COLLIDER.checkX(e, context.level);
        e.pos.y += e.vel.y * context.deltaTime;
        LEVEL_COLLIDER.checkY(e, context.level);
    }
}
