import Trait from '../../../engine/entities/trait';
import { SfxEvent } from '../../../engine/events/events';
import PlatformerEntity from '../../../platformer/entities/platformer.entity';
import { StompEvent } from '../../events/events';
import Killable from './killable';

export default class Stomp extends Trait {
    bounceSpeed = 400;
    quereBounce = false;
    stomped = false;

    constructor() {
        super('stomper');
    }

    fromAbove(
        entity: PlatformerEntity,

        target: PlatformerEntity,
    ): boolean {
        return entity.vel.y > target.vel.y;
    }

    collides(us: PlatformerEntity, them: PlatformerEntity): void {
        const killable = them.getTrait(Killable);
        if (us.getTrait(Killable).finalize || us.getTrait(Killable).dead) return;
        if (!killable || killable.dead) {
            return;
        }

        if (this.fromAbove(us, them)) {
            this.bounce(us, them);
            us.events.emit(new SfxEvent({ name: 'stomp' }));
            us.events.emit(new StompEvent({ us, them }));
        }
    }

    bounce(us: PlatformerEntity, them: PlatformerEntity): void {
        this.finalize = (): void => {
            us.bounds.bottom = them.bounds.top;
            us.vel.y = -this.bounceSpeed;
        };
    }
}
