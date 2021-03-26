import Trait, { Context } from '../../entities/trait';
import Entity from '../../entities/entity';

export default class Physics extends Trait {
    constructor() {
        super('physics');
    }

    update(e: Entity, context: Context): void {
        if (!context.collidable || !this.enabled) {
            return;
        }
        e.pos.x += e.vel.x * context.deltaTime;
        context.collidable.checkX(e);
        e.pos.y += e.vel.y * context.deltaTime;
        context.collidable.checkY(e);
    }
}
