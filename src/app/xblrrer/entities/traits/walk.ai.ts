import Entity from '../../../engine/entities/entity';
import Trait from '../../../engine/entities/trait';
import { Side } from '../../../engine/world/tiles/side';

export default class Walk extends Trait {
    enabled = true;
    constructor(public speed = -30) {
        super('walk');
    }
    update(entity: Entity): void {
        if (this.enabled) {
            entity.vel.x = this.speed;
        }
    }
    obstruct(entity: Entity, s: Side): void {
        if (s === Side.LEFT || s === Side.RIGHT) {
            this.speed *= -1;
        }
    }
}
