import { FeatherEngine, Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityPrefab, Side } from '@dialthetti/feather-engine-entities';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import ActivateOnSight from 'src/app/core/entities/activateOnSight';
import TraitAdapter, { Context } from 'src/app/core/entities/trait';
import Gravity from 'src/app/core/physics/traits/gravity';
import Physics from 'src/app/core/physics/traits/physics';
import Solid from 'src/app/core/physics/traits/solid';
import { PlaySfxEvent } from 'src/app/core/sfx';
import { Killable, Stomp } from '../traits';
import { PlatformerTraitContext } from '../traits/traits';

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
class SlimeJumping extends TraitAdapter {
    direction = -1;

    jumping = false;
    jumpTime = new Interval(0.1);
    onGround = true;

    constructor(private jumpingInterval = new Interval(3, true)) {
        super('slime_jumping');
    }

    update(entity: PlatformerEntity, context: Context) {
        if (this.onGround) {
            this.jumpingInterval.update(context.deltaTime, () => {
                this.jumping = true;

                const pos = (entity.bounds.left - context.camera.box.left) / FeatherEngine.screenSize.width;
                FeatherEngine.eventBus.publish(
                    new PlaySfxEvent({ name: 'jump', blocking: false, position: 2 * pos - 1 }),
                );
            });
        }
        if (this.jumping) {
            entity.vel.x = 100 * this.direction;

            entity.vel.y = -200;

            this.jumpTime.update(context.deltaTime, () => {
                this.jumping = false;
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

class RandomChangeDirection extends TraitAdapter {
    changeDir = new Interval(2);
    lastDelta: number = 0;
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

class TowardsPlayerDirection extends TraitAdapter {
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
    constructor(name: string, directionTrait: new () => TraitAdapter, jumpTrait: () => TraitAdapter) {
        super(name, name);
        this.size = new Vector(16, 16);
        this.offset = new Vector(0, -4);
        this.traits = (): TraitAdapter[] => [
            new ActivateOnSight(),
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
