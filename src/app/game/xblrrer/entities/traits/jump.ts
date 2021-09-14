import ATrait, { Context } from '@engine/core/entities/trait';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { FeatherEngine } from '@dialthetti/feather-engine-core';
import { Entity, Side } from '@dialthetti/feather-engine-entities';
import { EventStack, Subject } from '@dialthetti/feather-engine-events';
import { SfxEvent } from 'src/app/core/sfx/events';
import Crouch from './crouch';

class JumpButtonPressed implements Subject<void> {
    topic = 'JumpButtonPressed';
    payload = null;
}

class JumpButtonReleased implements Subject<void> {
    topic = 'JumpButtonReleased';
    payload = null;
}

class CountDown {
    private currentVal: number;
    constructor(public readonly startVal: number) {
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
    get delta(): number {
        return this.startVal - this.currentVal;
    }
}
export default class Jump extends ATrait {
    private eventBuffer = new EventStack();
    private velocity = 220;
    private raisingTime = new CountDown(0.15);

    private onGround = 0;
    distance = 0;

    private lastDir = 0;

    constructor() {
        super('jump');
        this.raisingTime.toZero();
    }
    start(): void {
        this.eventBuffer.publish(new JumpButtonPressed());
    }
    cancel(): void {
        this.eventBuffer.publish(new JumpButtonReleased());
    }
    update(entity: Entity, context: Context): void {
        this.eventBuffer.process('JumpButtonReleased', {
            receive: () => {
                this.raisingTime.toZero();
                if (entity.vel.y < 0) {
                    entity.vel.y = -this.velocity / 2;
                }
            },
        });
        this.eventBuffer.process('JumpButtonPressed', {
            receive: () => {
                const crouch = entity.getTrait(Crouch);

                if (crouch?.down) {
                    if (entity instanceof PlatformerEntity) {
                        if (entity.standingOn.has('platform')) {
                            entity.bypassPlatform = true;
                        }
                    }
                    this.raisingTime.toZero();
                    return;
                }
                if (!this.falling) {
                    entity.bypassPlatform = true;
                    this.raisingTime.reset();

                    const pos = (entity.bounds.left - context.camera.box.left) / FeatherEngine.screenSize.width;
                    entity.events.publish(new SfxEvent({ name: 'jump', blocking: false, position: 2 * pos - 1 }));
                }
            },
        });

        if (this.raisingTime.notZero()) {
            entity.bypassPlatform = false;
            entity.vel.y = -this.velocity;
            this.raisingTime.decrease(context.deltaTime);
        }
        const dir = Math.sign(entity.vel.y);
        if (this.lastDir != dir) {
            this.distance = 0;
        }
        this.lastDir = dir;

        const absY = Math.abs(entity.vel.y);
        this.distance += absY * context.deltaTime;
        this.onGround--;
    }
    obstruct(entity: Entity, side: Side): void {
        if (side === Side.BOTTOM) {
            this.onGround = 1;
            this.distance = 0;
        } else if (side === Side.TOP) {
            this.cancel();
            this.distance = 0;
        }
    }
    get falling(): boolean {
        return this.onGround < 0;
    }

    get timeOfCurrentPhase(): number {
        return this.distance;
    }
}
