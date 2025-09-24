import { Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityPrefab } from '@dialthetti/feather-engine-entities';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { DoorTrait } from '@game/entities/prefabs/door-prefab';
import { TouchableEntity } from '@game/entities/prefabs/touchable-entity';
import { Activatable, Context, Overlappable, TraitAdapter } from 'src/app/core/entities';
class LeverTrait extends TraitAdapter {
  flipped = false;
  constructor() {
    super('lever');
  }
  update(entity: TouchableEntity, context: Context): void {
    if (this.flipped) {
      return;
    }
    const overLappable = entity.getTrait(Overlappable);
    if (overLappable.overLappingWithPlayer(entity)) {
      this.flipped = true;
      const props = LeverPrefab.getProperties(entity);

      const target = [...context.level.entities].find(e => (e as PlatformerEntity)?.objectRef === props.target);

      target.getTrait(DoorTrait).closed = false;
    }
  }
}
export class LeverPrefab extends EntityPrefab {
  static getProperties(entity: PlatformerEntity): {
    target: any;
  } {
    return { target: {}, ...entity.properties };
  }

  constructor() {
    super('lever', 'door');
    this.size = new Vector(16, 2);
    this.offset = new Vector(0, 14);
    this.traits = (): TraitAdapter[] => [new Overlappable(), new LeverTrait()];
  }
  entityFac = (): TouchableEntity => new TouchableEntity();
  routeFrame(entity: Entity, sprite: SpriteSheet): string {
    return 'pressure_plate';
  }
}
