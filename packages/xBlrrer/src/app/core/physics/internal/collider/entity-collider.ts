import { Entity } from '@dialthetti/feather-engine-entities';

export class EntityCollider {
  constructor(private entities: Set<Entity>) {}

  check(subject: Entity): void {
    [...this.entities]
      .filter(canditate => subject !== canditate)
      .filter(canditate => subject.bounds.overlaps(canditate.bounds))
      .forEach(canditate => subject.collide(canditate));
  }
}
