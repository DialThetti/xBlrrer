import Level from 'src/app/core/level/level';
import { LEVEL_COLLIDER } from 'src/app/core/level/level-collider';
import LevelTrait from 'src/app/core/level/level-trait';

export default class EntityColliderTrait implements LevelTrait {
    update(level: Level): void {
        level.entities.forEach((e) => LEVEL_COLLIDER.check(e, level));
    }
}
