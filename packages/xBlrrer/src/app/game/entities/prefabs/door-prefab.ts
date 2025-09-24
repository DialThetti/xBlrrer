import { Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityPrefab } from '@dialthetti/feather-engine-entities';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { Context, TraitAdapter } from 'src/app/core/entities';
import { Solid } from 'src/app/core/physics';
export class DoorTrait extends TraitAdapter {
  constructor() {
    super('door');
  }
  _closed = true;
  set closed(b: boolean) {
    this._closed = b;
  }
  get closed(): boolean {
    return this._closed;
  }
  update(entity: Entity, context: Context): void {
    entity.size.y = this.closed ? 32 : 0;
    entity.getTrait(Solid).config.forEntities = this.closed;
  }
}
export class DoorPrefab extends EntityPrefab {
  constructor() {
    super('door', 'door');
    this.traits = (): TraitAdapter[] => [new Solid({ forEntities: true }), new DoorTrait()];
    this.size = new Vector(16, 32);
    this.offset = new Vector(0, 0);
  }
  entityFac = (): PlatformerEntity => {
    const e = new PlatformerEntity();

    return e;
  };
  routeFrame(entity: Entity, sprite: SpriteSheet): string {
    const trait = entity.getTrait(DoorTrait);
    if (!trait.closed) {
      return '';
    }
    return 'closed';
  }
}
