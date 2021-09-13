import ATrait, { Context } from '@engine/core/entities/trait';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Killable from '@extension/platformer/entities/traits/killable';
import { FeatherEngine } from 'feather-engine-core';
import { Entity, Side } from 'feather-engine-entities';
import { SfxEvent } from 'src/app/core/sfx/events';
import Crouch from './crouch';
import Jump from './jump';

export default class Go extends ATrait {
    private acceleration = 400;
    private deceleration = 300;

    private goLeft = false;
    private goRight = false;
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
            if (this.distance != 0) entity.events.publish(new SfxEvent({ name: 'bump' }));
            this.distance = 0;
        }
    }

    update(entity: PlatformerEntity, context: Context): void {
        if (entity.bounds.left < 0) entity.bounds.left = 0;
        const jump = entity.getTrait(Jump);
        const killable = entity.getTrait(Killable);
        const crouch = entity.getTrait(Crouch);

        const dirOfAppliedForce = this.goRight ? 1 : this.goLeft ? -1 : 0;
        if (dirOfAppliedForce !== 0) {
            if (jump && !jump.falling) {
                this.facingDirection = dirOfAppliedForce;
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
        if (dirOfAppliedForce !== 0) {
            entity.vel.x += this.acceleration * dirOfAppliedForce * context.deltaTime;
        } else if (entity.vel.x !== 0) {
            this.decelToStand(entity, context.deltaTime);
        } else {
            if (FeatherEngine.debugSettings.enabled && this.distance !== 0) {
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
        this.goRight = accel;
        if (accel) this.goLeft = false;
    }

    public left(accel: boolean) {
        this.goLeft = accel;
        if (accel) this.goRight = false;
    }
}
