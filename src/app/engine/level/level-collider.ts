import Collidable from '@engine/core/physics/collidable';
import LevelCollider from '@extension/platformer/level.collider';
import { Entity } from '@dialthetti/feather-engine-entities';
import Level from './level';

class X implements Collidable {
    /**
     * Check the x-Axes for collition. If collition, may modify the entity passed as argument
     * @param entity
     */
    checkX(entity: Entity, level: Level): void {
        new LevelCollider(level as any).checkX(entity);
    }
    /**
     * Check the y-Axes for collition. If collition, may modify the entity passed as argument
     * @param entity
     */
    checkY(entity: Entity, level: Level): void {
        new LevelCollider(level as any).checkY(entity);
    }

    check(entity: Entity, level: Level): void {
        new LevelCollider(level as any).check(entity);
    }
}

export const LEVEL_COLLIDER: Collidable = new X();
