import { debug, FeatherEngine } from '@dialthetti/feather-engine-core';
import { Entity, Side } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { Context, TraitAdapter } from 'src/app/core/entities';
import { PlaySfxEvent } from 'src/app/core/sfx';
import Crouch from './crouch';
import Jump from './jump';
import Killable from './killable';

export default class Go extends TraitAdapter {
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
      if (this.distance != 0) FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'bump' }));
      this.distance = 0;
    }
  }

  update(entity: PlatformerEntity, context: Context): void {
    if (entity.bounds.left < 0) entity.bounds.left = 0;
    const jump = entity.getTrait(Jump);
    const killable = entity.getTrait(Killable);
    const crouch = entity.getTrait(Crouch);

    const dirOfAppliedForce = this.getDirection();
    this.turnToMovementDirection(dirOfAppliedForce, jump);
    if (crouch.down) {
      this.decelToStand(entity, context.deltaTime / 3);
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
      this.resetMovement(entity);
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;
    this.distance += absX * context.deltaTime;
  }

  private resetMovement(entity: PlatformerEntity) {
    if (FeatherEngine.debugSettings.enabled && this.distance !== 0) {
      debug(this, `Standing at ${Math.round(entity.pos.x / 16)},${Math.round(entity.pos.y / 16)}`);
    }
    this.distance = 0;
  }

  getDirection(): number {
    if (this.goRight) {
      return 1;
    }
    if (this.goLeft) {
      return -1;
    }
    return 0;
  }

  private turnToMovementDirection(dirOfAppliedForce: number, jump: Jump) {
    if (dirOfAppliedForce !== 0) {
      if (jump && !jump.falling) {
        this.facingDirection = dirOfAppliedForce;
      }
    }
  }

  private decelToStand(entity: Entity, deltaTime: number) {
    const absX = Math.abs(entity.vel.x);
    const decel = Math.min(absX, this.deceleration * deltaTime);
    entity.vel.x += entity.vel.x > 0 ? -decel : decel;
  }

  public right(accel: boolean): void {
    this.goRight = accel;
    if (accel) this.goLeft = false;
  }

  public left(accel: boolean): void {
    this.goLeft = accel;
    if (accel) this.goRight = false;
  }
}
