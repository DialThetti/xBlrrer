import Trait, { Context } from '../../entities/trait';
import Entity from '../../entities/entity';
import Vector from '../../math/vector';

export default class Gravity extends Trait {
    constructor(private gravity = new Vector(0, 1500)) {
        super('gravity');
    }

    update(entity: Entity, context: Context): void {
        if (!this.enabled) {
            return;
        }
        const scaled = this.gravity.getScaledBy(context.deltaTime);
        entity.vel.add(scaled);
    }
}
