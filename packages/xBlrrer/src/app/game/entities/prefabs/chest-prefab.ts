import { random, Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityPrefab, entityRepo, EntityState } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';

import { SpawnEvent, TraitAdapter } from 'src/app/core/entities';
import { Killable, Player, Stomp } from '../traits';

class ChestTrait extends TraitAdapter {
  prepareForCleanup = false;
  initialized = false;
  constructor() {
    super('chestTrait');
  }

  update(entity: PlatformerEntity): void {
    if (this.initialized) return;
    const killable = entity.getTrait(Killable);
    if (killable) {
      if (killable.hp <= 0) {
        killable.finalize = () => {
          this.spawnShiny(entity);
          killable.dead = true;
        };
        this.initialized = true;
      }
    }
  }
  collides(entity: PlatformerEntity, target: Entity): void {
    if (this.prepareForCleanup) entity.state = EntityState.READY_TO_REMOVE;

    if (!target.getTrait(Player)) {
      return;
    }
    if (target.bounds.bottom > entity.bounds.top && target.bounds.top < entity.bounds.top && target.vel.y > 0) {
      this.spawnShiny(entity);

      this.prepareForCleanup = true;
      if (target.getTrait(Stomp)) {
        target.getTrait(Stomp).bounce(target, entity);
      }
      return;
    }
    if (target.bounds.right > entity.bounds.left && target.bounds.left < entity.bounds.left) {
      target.bounds.right = entity.bounds.left;
    }
    if (target.bounds.left < entity.bounds.right && target.bounds.right > entity.bounds.right) {
      target.bounds.left = entity.bounds.right;
    }
  }

  spawnShiny(entity: PlatformerEntity): void {
    const value = ChestPrefab.getProperties(entity)['contentValue'];

    for (let index = 0; index < value; index++) {
      const e = entityRepo['shiny']();
      e.vel.x = 100 * (Math.random() - Math.random());
      e.vel.y = -(random(400) + 100);
      e.state = EntityState.ACTIVE;
      e.pos.set(entity.pos.x, entity.pos.y);
      entity.events.publish(new SpawnEvent({ entity: e }));
    }
  }
}
export class ChestPrefab extends EntityPrefab {
  static getProperties(entity: PlatformerEntity): {
    contentValue: number;
  } {
    return { contentValue: 1, ...entity.properties };
  }
  constructor() {
    super('chest', 'chest');
    this.size = new Vector(16, 14);
    this.offset = new Vector(0, 2);
    this.traits = (): TraitAdapter[] => [new ChestTrait(), new Killable('', 1, 0)];
  }
  entityFac = (): Entity => new PlatformerEntity() as Entity;

  routeFrame(): string {
    return 'idle';
  }
}
