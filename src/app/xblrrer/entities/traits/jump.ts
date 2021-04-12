import Trait, { Context } from '../../../engine/entities/trait';
import { SfxEvent } from '../../../engine/events/events';
import { Side } from '../../../engine/world/tiles/side';
import PlatformerEntity from '../../../platformer/entities/platformer.entity';
import Crouch from './crouch';

export default class Jump extends Trait {
    private jumpHeight = 1; /*in blocks*/
    private duration = this.jumpHeight / 12;
    private velocity = 200;
    private engageTime = 0;
    private onGround = 0;
    private requestTime = 0;
    private gracePeriod = 0.1;

    time = 0;

    constructor() {
        super('jump');
    }
    start(): void {
        this.requestTime = this.gracePeriod;
        this.time = 0;
    }
    cancel(): void {
        this.engageTime = 0;
        this.requestTime = 0;
    }
    update(entity: PlatformerEntity, context: Context): void {
        const crouch = entity.getTrait(Crouch);
        if (this.requestTime > 0) {
            if (crouch?.down) {
                if (entity.standingOn.has('platform')) {
                    entity.bypassPlatform = true;
                }
                this.cancel();
                return;
            }
            if (!this.falling) {
                entity.bypassPlatform = true;
                this.engageTime = this.duration;
                this.requestTime = 0;
                entity.events.emit(new SfxEvent({ name: 'jump' }));
            }
            this.requestTime -= context.deltaTime;
        }
        if (this.engageTime > 0) {
            entity.bypassPlatform = false;
            entity.vel.y = -this.velocity;
            this.engageTime -= context.deltaTime;
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
