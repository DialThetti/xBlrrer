import Entity from '../entities/entity';

export default interface Collidable {
    /**
     * Check the x-Axes for collition. If collition, may modify the entity passed as argument
     * @param entity
     */
    checkX(entity: Entity): void;
    /**
     * Check the y-Axes for collition. If collition, may modify the entity passed as argument
     * @param entity
     */
    checkY(entity: Entity): void;
}
