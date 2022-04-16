import { Level } from 'src/app/core/level';
import { LEVEL_COLLIDER } from 'src/app/core/level/internal/level-collider';
import { LevelTrait } from 'src/app/core/level';

export default class EntityColliderTrait implements LevelTrait {
  update(level: Level): void {
    level.entities.forEach(e => LEVEL_COLLIDER.check(e, level));
  }
}
