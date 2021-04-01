import Trait, { Context } from '../../../engine/entities/trait';
import { SfxEvent } from '../../../engine/events/events';
import { Side } from '../../../engine/world/tiles/side';
import EntityImpl from '../../../platformer/entities/entity';

export default class Jump extends Trait {
    private jumpHeight = 1; /*in blocks*/
    private duration = this.jumpHeight / 12;
    private velocity = 200;
    private engageTime = 0;
    private onGround = 0;
    private requestTime = 0;
    private gracePeriod = 0.1;

    private glideDrag = 750 * 0.95;
    gliding = false;
    time = 0;

    down = false;

    constructor() {
        super('jump');
    }
    start(): void {
        if (this.falling) {
            console.log('glide start');
            this.gliding = true;
        }
        this.requestTime = this.gracePeriod;
        this.time = 0;
    }
    cancel(): void {
        this.engageTime = 0;
        this.requestTime = 0;
        if (this.gliding) {
            console.log('glide end');
            this.gliding = false;
        }
    }
    update(entity: EntityImpl, context: Context): void {
        if (!this.down && this.gliding && entity.vel.y < 0) {
            entity.vel.y = 0;
        }
        if (this.requestTime > 0) {
            if (this.down) {
                if (entity.standingOn.has('platform')) {
                    entity.bypassPlatform = true;
                    this.cancel();
                    return;
                }
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
            if (!this.gliding) entity.vel.y = -this.velocity;
            this.engageTime -= context.deltaTime;
        }
        if (this.gliding) entity.vel.y -= this.glideDrag * context.deltaTime;
        const absY = Math.abs(entity.vel.y);
        this.time += absY * context.deltaTime;
        this.onGround--;
    }
    obstruct(entity: EntityImpl, side: Side): void {
        if (side === Side.BOTTOM) {
            this.onGround = 1;
            if (this.gliding) {
                console.log('glide end');
                this.gliding = false;
            }
        } else if (side === Side.TOP) {
            this.cancel();
        }
    }
    get falling(): boolean {
        return this.onGround < 0;
    }
}
