import { Entity } from '@dialthetti/feather-engine-entities';
import LevelCollider from '@extension/platformer/level/level-collider';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { Collidable } from 'src/app/core/physics/internal/collidable';
import { Level } from './level';

class X implements Collidable {
  /**
   * Check the x-Axes for collition. If collition, may modify the entity passed as argument
   * @param entity
   */
  checkX(entity: Entity, level: Level): void {
    if (level instanceof PlatformerLevel) {
      new LevelCollider(level).checkX(entity);
    }
  }
  /**
   * Check the y-Axes for collition. If collition, may modify the entity passed as argument
   * @param entity
   */
  checkY(entity: Entity, level: Level): void {
    if (level instanceof PlatformerLevel) {
      new LevelCollider(level).checkY(entity);
    }
  }

  check(entity: Entity, level: Level): void {
    if (level instanceof PlatformerLevel) {
      new LevelCollider(level).check(entity);
    }
  }
}

export const LEVEL_COLLIDER: Collidable = new X();
