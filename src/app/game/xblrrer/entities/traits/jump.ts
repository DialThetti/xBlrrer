import Trait, { Context } from '@engine/core/entities/trait';
import Event from '@engine/core/events/event';
import EventBuffer from '@engine/core/events/eventBuffer';
import { SfxEvent } from '@engine/core/events/events';
import { Side } from '@engine/core/world/tiles/side';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Crouch from './crouch';

class JumpButtonPressed implements Event<void> {
    name = 'JumpButtonPressed';
    payload = null;
}

class JumpButtonReleased implements Event<void> {
    name = 'JumpButtonReleased';
    payload = null;
}

class CountDown {
    private currentVal: number;

    constructor(private startVal: number) {
        this.currentVal = startVal;
    }

    decrease(val: number): void {
        this.currentVal -= val;
    }
    reset() {
        this.currentVal = this.startVal;
    }
    toZero() {
        this.currentVal = 0;
    }
    notZero() {
        return this.currentVal > 0;
    }
}
export default class Jump extends Trait {
    private eventBuffer = new EventBuffer();
    private velocity = 220;
    private raisingTime = new CountDown(0.15);

    private onGround = 0;
    time = 0;

    constructor() {
        super('jump');
        this.raisingTime.toZero();
    }
    start(): void {
        this.eventBuffer.emit(new JumpButtonPressed());
    }
    cancel(): void {
        this.eventBuffer.emit(new JumpButtonReleased());
    }
    update(entity: PlatformerEntity, context: Context): void {
        this.eventBuffer.process('JumpButtonReleased', () => {
            this.raisingTime.toZero();
            if (entity.vel.y < 0) {
                entity.vel.y = -this.velocity / 2;
            }
        });
        this.eventBuffer.process('JumpButtonPressed', () => {
            const crouch = entity.getTrait(Crouch);

            if (crouch?.down) {
                if (entity.standingOn.has('platform')) {
                    entity.bypassPlatform = true;
                }
                this.raisingTime.toZero();
                return;
            }
            if (!this.falling) {
                entity.bypassPlatform = true;
                this.raisingTime.reset();
                entity.events.emit(new SfxEvent({ name: 'jump' }));
            }
        });

        if (this.raisingTime.notZero()) {
            entity.bypassPlatform = false;
            entity.vel.y = -this.velocity;
            this.raisingTime.decrease(context.deltaTime);
        }
        const absY = Math.abs(entity.vel.y);
        this.time += absY * context.deltaTime;
        this.onGround--;
    }
    obstruct(entity: PlatformerEntity, side: Side): void {
        if (side === Side.BOTTOM) {
            this.onGround = 1;
            this.time = 0;
        } else if (side === Side.TOP) {
            this.cancel();
        }
    }
    get falling(): boolean {
        return this.onGround < 0;
    }
}
