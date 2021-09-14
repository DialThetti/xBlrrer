import Level from '@engine/level/level';
import { LEVEL_COLLIDER } from '@engine/level/level-collider';
import LevelTrait from '@engine/level/level-trait';

export default class EntityColliderTrait implements LevelTrait {
    update(level: Level): void {
        level.entities.forEach((e) => LEVEL_COLLIDER.check(e, level));
    }
}
