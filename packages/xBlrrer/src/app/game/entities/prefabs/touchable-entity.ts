import { Entity } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { Touchable } from 'src/app/core/entities/internal/overlappable';

export class TouchableEntity extends PlatformerEntity implements Touchable {
  isOverlappingWith: Set<Entity> = new Set();
  onEnter(target: Entity): void {
    this.isOverlappingWith.add(target);
  }
  onLeave(target: Entity): void {
    this.isOverlappingWith.delete(target);
  }
  onOver(): void {
    //noop
  }
}
