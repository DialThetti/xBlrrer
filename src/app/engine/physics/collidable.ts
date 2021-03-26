import Entity from '../entities/entity';

export default interface Collidable {
    checkX(entity: Entity);
    checkY(entity: Entity);
}
