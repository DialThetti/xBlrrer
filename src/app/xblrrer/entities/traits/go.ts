import { debugSettings } from '../../../engine/debug';
import Entity from '../../../engine/entities/entity';
import Trait, { Context } from '../../../engine/entities/trait';
import { SfxEvent } from '../../../engine/events/events';
import { Side } from '../../../engine/world/tiles/side';
import PlatformerEntity from '../../../platformer/entities/platformer.entity';
import Killable from '../../../platformer/entities/traits/killable';
import Crouch from './crouch';
import Jump from './jump';

export default class Go extends Trait {
    dirOfAppliedForce = 0;
    private acceleration = 400;
    private deceleration = 300;
    distance = 0;
    facingDirection = 0;
    running = false;
    constructor() {
        super('go');
    }
    get dragFactor(): number {
        return this.running ? 1 / 5000 : 1 / 2000;
    }
    obstruct(entity: Entity, side: Side): void {
        if (side === Side.LEFT || side === Side.RIGHT) {
            if (this.distance != 0) entity.events.emit(new SfxEvent({ name: 'bump' }));
            this.distance = 0;
        }
    }

    update(entity: PlatformerEntity, context: Context): void {
        const jump = entity.getTrait(Jump);
        const killable = entity.getTrait(Killable);
        const crouch = entity.getTrait(Crouch);
        if (this.dirOfAppliedForce !== 0) {
            if (jump && !jump.falling) {
                this.facingDirection = this.dirOfAppliedForce;
            }
        }
        if (crouch.down) {
            this.decelToStand(entity, context.deltaTime);
            return;
        }

        if (killable && killable.dead) {
            entity.vel.set(0, 0);
            return;
        }

        const absX = Math.abs(entity.vel.x);
        if (this.dirOfAppliedForce !== 0) {
            entity.vel.x += this.acceleration * this.dirOfAppliedForce * context.deltaTime;
        } else if (entity.vel.x !== 0) {
            this.decelToStand(entity, context.deltaTime);
        } else {
            if (debugSettings.enabled && this.distance !== 0) {
                console.log('Standing at', Math.round(entity.pos.x / 16), Math.round(entity.pos.y / 16));
            }
            this.distance = 0;
        }

        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;
        this.distance += absX * context.deltaTime;
    }

    private decelToStand(entity: Entity, deltaTime: number) {
        const absX = Math.abs(entity.vel.x);
        const decel = Math.min(absX, this.deceleration * deltaTime);
        entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    }

    public right(accel: boolean) {
        this.dirOfAppliedForce += accel ? 1 : -1;
    }

    public left(accel: boolean) {
        this.dirOfAppliedForce -= accel ? 1 : -1;
    }
}
