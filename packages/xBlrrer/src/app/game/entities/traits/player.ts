import { Entity } from '@dialthetti/feather-engine-entities';
import { Activatable, TraitAdapter } from 'src/app/core/entities';
import { TouchableEntity } from '../prefabs/touchable-entity';

export default class Player extends TraitAdapter {
  active = false;
  constructor() {
    super('player');
  }

  update(entity: Entity): void {
    if (this.active) {
      if (entity instanceof TouchableEntity) {
        entity.isOverlappingWith.forEach(target => {
          if (target.hasTrait(Activatable)) {
            (target.getTrait(Activatable) as Activatable).activate();
          }
        });
      }
    }
    this.active = false;
  }
  activate(): void {
    this.active = true;
  }
}
