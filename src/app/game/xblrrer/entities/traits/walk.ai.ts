import Entity from '@engine/core/entities/entity';
import Trait from '@engine/core/entities/trait';
import { Side } from '@engine/core/world/tiles/side';

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
