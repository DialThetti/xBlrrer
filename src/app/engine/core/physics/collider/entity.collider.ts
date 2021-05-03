import Entity from '../../entities/entity';

export default class EntityCollider {
    constructor(private entities: Set<Entity>) {}

    check(subject: Entity): void {
        [...this.entities]
            .filter((canditate) => subject !== canditate)
            .filter((canditate) => subject.bounds.overlaps(canditate.bounds))
            .forEach((canditate) => subject.collide(canditate));
    }
}
