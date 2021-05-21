import Level from '@engine/level/level';
import Entity from '../entities/entity';

export default interface Collidable {
    /**
     * Check the x-Axes for collition. If collition, may modify the entity passed as argument
     * @param entity
     */
    checkX(entity: Entity, level: Level): void;
    /**
     * Check the y-Axes for collition. If collition, may modify the entity passed as argument
     * @param entity
     */
    checkY(entity: Entity, level: Level): void;

    check(entity: Entity, level: Level): void;
}
