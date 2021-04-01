import { debug } from '../../../engine/debug';
import Entity from '../../../engine/entities/entity';
import Trait, { Context } from '../../../engine/entities/trait';
import { SfxEvent } from '../../../engine/events/events';
import { Side } from '../../../engine/world/tiles/side';
import EntityImpl from '../../../platformer/entities/entity';
import Crouch from './crouch';
import Jump from './jump';
import Killable from './killable';

export default class Go extends Trait {
    dir = 0;
    private acceleration = 400;

    deceleration = 300;
    distance = 0;
    lastDir = 0;
    running = false;
    crouching = false;
    constructor() {
        super('go');
    }
    get dragFactor(): number {
        if (this.crouching) {
            return 1 / 100;
        }
        return this.running ? 1 / 5000 : 1 / 2000;
    }
    obstruct(entity: Entity, side: Side): void {
        if (side === Side.LEFT || side === Side.RIGHT) {
            if (this.distance != 0) entity.events.emit(new SfxEvent({ name: 'bump' }));
            this.distance = 0;
        }
    }

    update(entity: EntityImpl, context: Context): void {
        const jump = entity.getTrait(Jump);
        const killable = entity.getTrait(Killable);
        const crouch = entity.getTrait(Crouch);
        this.crouching = crouch.down;
        if (killable && killable.dead) {
            entity.vel.set(0, 0);
            return;
        }

        const absX = Math.abs(entity.vel.x);
        if (this.dir !== 0) {
            if (jump && !jump.falling) {
                this.lastDir = this.dir;
            }
            entity.vel.x += this.acceleration * this.dir * context.deltaTime;
        } else if (entity.vel.x !== 0) {
            const decel = Math.min(absX, this.deceleration * context.deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -decel : decel;
        } else {
            if (debug && this.distance !== 0) {
                console.log('Standing at', Math.round(entity.pos.x / 16), Math.round(entity.pos.y / 16));
            }
            this.distance = 0;
        }

        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;
        this.distance += absX * context.deltaTime;
    }
}
