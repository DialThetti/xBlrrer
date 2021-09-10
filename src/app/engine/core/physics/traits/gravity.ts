import { Vector } from 'feather-engine-core';
import { Entity } from 'feather-engine-entities';
import ATrait, { Context } from '../../entities/trait';

export default class Gravity extends ATrait {
    constructor(public gravity = new Vector(0, 1500)) {
        super('gravity');
    }

    update(entity: Entity, context: Context): void {
        const scaled = this.gravity.getScaledBy(context.deltaTime);
        entity.vel.add(scaled);
    }
}
