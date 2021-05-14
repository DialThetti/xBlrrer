import Entity from '../../entities/entity';
import Trait, { Context } from '../../entities/trait';

export default class Physics extends Trait {
    constructor() {
        super('physics');
    }

    update(e: Entity, context: Context): void {
        debugger;
        if (!context.collidable || !this.enabled) {
            return;
        }
        e.pos.x += e.vel.x * context.deltaTime;
        context.collidable.checkX(e);
        e.pos.y += e.vel.y * context.deltaTime;
        context.collidable.checkY(e);
    }
}
