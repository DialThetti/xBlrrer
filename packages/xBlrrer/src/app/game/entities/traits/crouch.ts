import { Vector } from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';
import { Context, TraitAdapter } from 'src/app/core/entities';

export default class Crouch extends TraitAdapter {
  private internalDown = false;
  memoSize: Vector;
  memoOffset: Vector;
  lockDown = false;
  requestEnd = false;
  crouchTime = 0;
  standUpTime = 0.3;
  active = false;
  constructor() {
    super('crouch');
  }

  update(entity: Entity, context: Context): void {
    if (this.internalDown) {
      this.crouchTime += context.deltaTime;

      this.resetSize(entity);
    }
    if (this.requestEnd) {
      if (!this.lockDown) {
        this.end(entity);
        this.standUpTime += context.deltaTime;
        if (this.standUpTime > 0.3) {
          this.standUpTime = 0.3;
        }
      }
    }
    this.lockDown = false;
  }

  end(entity: Entity): void {
    if (this.standUpTime < 0.3) {
      return;
    }
    if (this.memoSize) {

      entity.size.set(this.memoSize.x, this.memoSize.y);
      entity.pos.y -= 12;
      this.memoSize = undefined;
      this.memoOffset = undefined;
      this.active = false;
    }
    this.internalDown = false;
    this.requestEnd = true;
  }

  start(): void {
    this.active = true;
    this.internalDown = true;
    this.requestEnd = false;
    this.crouchTime = 0;
    this.standUpTime = 0;
  }

  cancel(): void {
    this.requestEnd = true;
    this.standUpTime = 0;
  }

  get down(): boolean {
    return this.internalDown;
  }
  resetSize(entity: Entity): void {
    if (!this.memoSize) {
      this.memoSize = new Vector(entity.size.x, entity.size.y);
      this.memoOffset = new Vector(entity.offset.x, entity.offset.y);
      entity.pos.y += 12;
      entity.size.set(32, 20);
    }
  }
}
