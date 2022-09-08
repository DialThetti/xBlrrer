import { Entity } from '@dialthetti/feather-engine-entities';
import { LEVEL_COLLIDER } from 'src/app/core/level';
import { Context, TraitAdapter } from 'src/app/core/entities';

export class Physics extends TraitAdapter {
  constructor() {
    super('physics');
  }

  update(e: Entity, context: Context): void {
    if (!this.enabled) {
      return;
    }
    e.pos.x += e.vel.x * context.deltaTime;
    LEVEL_COLLIDER.checkX(e, context.level);
    e.pos.y += e.vel.y * context.deltaTime;
    LEVEL_COLLIDER.checkY(e, context.level);
  }
}
