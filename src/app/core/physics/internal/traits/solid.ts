import { Entity, Side } from '@dialthetti/feather-engine-entities';
import { PositionedTile } from 'src/app/core/level';
import { TraitAdapter } from 'src/app/core/entities/internal/trait';

export class Solid extends TraitAdapter {
  constructor() {
    super('solid');
  }

  obstruct(entity: Entity, side: Side, match: PositionedTile): void {
    if (!this.enabled) {
      return;
    }
    switch (side) {
      case Side.BOTTOM:
        entity.bounds.top = match.y.from - entity.size.y;
        entity.vel.y = 0;
        break;
      case Side.RIGHT:
        entity.bounds.left = match.x.from - entity.size.x;
        entity.vel.x = 0;
        break;
      case Side.LEFT:
        entity.bounds.left = match.x.to;
        entity.vel.x = 0;
        break;
      case Side.TOP:
        entity.bounds.top = match.y.to;
        entity.vel.y = 0;
        break;
    }
  }
}
