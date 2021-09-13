import ATrait, { Context } from '@engine/core/entities/trait';
import Gravity from '@engine/core/physics/traits/gravity';
import Physics from '@engine/core/physics/traits/physics';
import Solid from '@engine/core/physics/traits/solid';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Killable from '@extension/platformer/entities/traits/killable';
import { PlatformerTraitContext } from '@extension/platformer/entities/traits/traits';
import { FeatherEngine, Vector } from 'feather-engine-core';
import { Entity, EntityPrefab, Side } from 'feather-engine-entities';
import { SpriteSheet } from 'feather-engine-graphics';
import { SfxEvent } from 'src/app/core/sfx/events';
import Stomp from '../traits/stomp';

class Interval {
    currentTime = 0;
    constructor(private interval: number, initialOffset?: boolean, private f?: () => void) {
        if (initialOffset) {
            this.currentTime = Math.random() * interval;
        }
    }
    update(deltaTime: number, f?: () => void) {
        this.currentTime += deltaTime;
        if (this.currentTime >= this.interval) {
            this.currentTime = 0;
            if (f) {
                f();
            } else this.f();
        }
    }
}
class SlimeJumping extends ATrait {
    direction: number = -1;

    jumping = false;
    jumpTime = new Interval(0.1);
    onGround: boolean = true;

    constructor(private jumpingInterval = new Interval(3, true)) {
        super('slime_jumping');
    }

    update(entity: PlatformerEntity, context: Context) {
        if (this.onGround) {
            this.jumpingInterval.update(context.deltaTime, () => {
                this.jumping = true;

                const pos = (entity.bounds.left - context.camera.box.left) / FeatherEngine.screenSize.width;
                entity.events.publish(new SfxEvent({ name: 'jump', blocking: false, position: 2 * pos - 1 }));
            });
        }
        if (this.jumping) {
            entity.vel.x = 100 * this.direction;
            entity.vel.y = -200;
            this.jumpTime.update(context.deltaTime, () => {
                this.jumping = false;
                // this.direction = Math.sign(Math.random() - 0.5);

                this.jumpTime = new Interval(0.2 * Math.random());
            });
        }
    }
    obstruct(entity: Entity, side: Side): void {
        if (side === Side.BOTTOM) {
            this.onGround = true;
            this.jumping = false;
            entity.vel.x = 0;
        }
    }
    collides(us: Entity, them: Entity): void {
        const stomper = them.getTrait(Stomp);
        const themKillable = them.getTrait(Killable);
        const usKillable = us.getTrait(Killable);
        if (usKillable.dead) {
            return;
        }
        if (stomper) {
            if (stomper.fromAbove(them, us)) {
                if (usKillable) {
                    this.enabled = false;
                    usKillable.kill();
                }
            } else {
                themKillable.kill();
            }
        }
    }
}

class RandomChangeDirection extends ATrait {
    changeDir = new Interval(2);
    lastDelta: number;
    constructor() {
        super('slime_random_turn');
    }
    update(entity: Entity, context: Context) {
        this.lastDelta = context.deltaTime;
    }
    obstruct(entity: Entity, side: Side): void {
        if (side === Side.BOTTOM) {
            this.changeDir.update(this.lastDelta, () => {
                entity.getTrait(SlimeJumping).direction = Math.sign(Math.random() - 0.5);
            });
        }
    }
}

class TowardsPlayerDirection extends ATrait {
    changeDir = new Interval(2);
    lastDelta: number;
    deltaToPlayer: number;
    constructor() {
        super('slime_random_turn');
    }
    update(entity: Entity, context: PlatformerTraitContext) {
        this.lastDelta = context.deltaTime;
        this.deltaToPlayer = context.level.findPlayer().pos.x - entity.pos.x;
    }
    obstruct(entity: Entity, side: Side): void {
        if (side === Side.BOTTOM) {
            entity.getTrait(SlimeJumping).direction = Math.sign(this.deltaToPlayer);
        }
    }
}

class SlimePrefab extends EntityPrefab {
    constructor(name: string, directionTrait: new () => ATrait, jumpTrait: () => ATrait) {
        super(name, name);
        this.size = new Vector(16, 16);
        this.offset = new Vector(0, 0);
        this.traits = (): ATrait[] => [
            new Gravity(),
            new Solid(),
            new Physics(),
            new Killable('dead', 1, 0),
            jumpTrait(),
            new directionTrait(),
        ];
    }
    entityFac = (): PlatformerEntity => new PlatformerEntity();

    flipped(f: PlatformerEntity): boolean {
        const jumping = f.getTrait(SlimeJumping);
        return jumping.direction == -1;
    }

    routeFrame(entity: PlatformerEntity, sprite: SpriteSheet): string {
        const jumping = entity.getTrait(SlimeJumping);
        return sprite.getAnimation('idle')(entity.lifeTime * 60);
    }
}

export class BlueSlimePrefab extends SlimePrefab {
    constructor() {
        super('blue_slime', RandomChangeDirection, () => new SlimeJumping(new Interval(3, true)));
    }
}

export class RedSlimePrefab extends SlimePrefab {
    constructor() {
        super('red_slime', TowardsPlayerDirection, () => new SlimeJumping(new Interval(3, true)));
    }
}
