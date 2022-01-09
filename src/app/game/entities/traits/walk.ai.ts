import { Entity, Side } from '@dialthetti/feather-engine-entities';
import { TraitAdapter } from 'src/app/core/entities';

export default class Walk extends TraitAdapter {
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
