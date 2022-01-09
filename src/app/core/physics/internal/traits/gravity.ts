import { Vector } from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';
import { Context, TraitAdapter } from 'src/app/core/entities';

export class Gravity extends TraitAdapter {
    constructor(public gravity = new Vector(0, 1500)) {
        super('gravity');
    }

    update(entity: Entity, context: Context): void {
        const scaled = this.gravity.getScaledBy(context.deltaTime);
        entity.vel.add(scaled);
    }
}
