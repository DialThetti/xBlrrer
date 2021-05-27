import EntityPrefab from '@engine/core/entities/entity.prefab';
import Trait, { Context } from '@engine/core/entities/trait';
import Gravity from '@engine/core/physics/traits/gravity';
import Physics from '@engine/core/physics/traits/physics';
import Solid from '@engine/core/physics/traits/solid';
import SpriteSheet from '@engine/core/rendering/spriteSheet';
import { Side } from '@engine/core/world/tiles/side';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Killable from '@extension/platformer/entities/traits/killable';
import { PlatformerTraitContext } from '@extension/platformer/entities/traits/traits';
import { Vector } from 'feather-engine-core';
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
class SlimeJumping extends Trait {
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
    obstruct(entity: PlatformerEntity, side: Side): void {
        if (side === Side.BOTTOM) {
            this.onGround = true;
            this.jumping = false;
            entity.vel.x = 0;
        }
    }
    collides(us: PlatformerEntity, them: PlatformerEntity): void {
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

class RandomChangeDirection extends Trait {
    changeDir = new Interval(2);
    lastDelta: number;
    constructor() {
        super('slime_random_turn');
    }
    update(entity: PlatformerEntity, context: Context) {
        this.lastDelta = context.deltaTime;
    }
    obstruct(entity: PlatformerEntity, side: Side): void {
        if (side === Side.BOTTOM) {
            this.changeDir.update(this.lastDelta, () => {
                entity.getTrait(SlimeJumping).direction = Math.sign(Math.random() - 0.5);
            });
        }
    }
}

class TowardsPlayerDirection extends Trait {
    changeDir = new Interval(2);
    lastDelta: number;
    deltaToPlayer: number;
    constructor() {
        super('slime_random_turn');
    }
    update(entity: PlatformerEntity, context: PlatformerTraitContext) {
        this.lastDelta = context.deltaTime;
        this.deltaToPlayer = context.level.findPlayer().pos.x - entity.pos.x;
    }
    obstruct(entity: PlatformerEntity, side: Side): void {
        if (side === Side.BOTTOM) {
            entity.getTrait(SlimeJumping).direction = Math.sign(this.deltaToPlayer);
        }
    }
}

class SlimePrefab extends EntityPrefab {
    constructor(name: string, directionTrait: new () => Trait, jumpTrait: () => Trait) {
        super(name, name);
        this.size = new Vector(16, 16);
        this.offset = new Vector(0, 0);
        this.traits = (): Trait[] => [
            new Gravity(),
            new Solid(),
            new Physics(),
            new Killable('dead', 0),
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
