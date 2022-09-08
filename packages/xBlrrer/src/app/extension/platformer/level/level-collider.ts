import { Entity } from '@dialthetti/feather-engine-entities';
import { EntityCollider, TileCollider } from 'src/app/core/physics';
import PlatformerLevel from './platformer-level';

export default class LevelCollider {
  private tileCollider: TileCollider;
  private entityCollider: EntityCollider;

  constructor(level: PlatformerLevel) {
    this.entityCollider = new EntityCollider(level.entities);
    this.tileCollider = new TileCollider(level, level.tilesize);
  }

  checkX(entity: Entity): void {
    this.tileCollider.checkX(entity);
  }
  checkY(entity: Entity): void {
    this.tileCollider.checkY(entity);
  }

  check(entity: Entity): void {
    this.entityCollider.check(entity);
  }
}
