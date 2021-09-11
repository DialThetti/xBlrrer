import ATrait from '@engine/core/entities/trait';
import { SfxEvent } from '@engine/core/io/sfx/events';
import Killable from '@extension/platformer/entities/traits/killable';
import { Entity } from 'feather-engine-entities';
import { StompEvent } from '../events';

export default class Stomp extends ATrait {
    bounceSpeed = 150;
    quereBounce = false;
    stomped = false;

    constructor() {
        super('stomper');
    }

    fromAbove(entity: Entity, target: Entity): boolean {
        return entity.vel.y > target.vel.y;
    }

    collides(us: Entity, them: Entity): void {
        const killable = them.getTrait(Killable);
        if (us.getTrait(Killable).finalize || us.getTrait(Killable).dead) return;
        if (!killable || killable.dead) {
            return;
        }

        if (this.fromAbove(us, them)) {
            this.bounce(us, them);
            us.events.publish(new SfxEvent({ name: 'stomp' }));
            us.events.publish(new StompEvent({ us, them }));
        }
    }

    bounce(us: Entity, them: Entity): void {
        this.finalize = (): void => {
            us.bounds.bottom = them.bounds.top;
            us.vel.y = -this.bounceSpeed;
        };
    }
}
