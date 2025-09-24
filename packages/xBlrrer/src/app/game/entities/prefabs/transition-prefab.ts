import { FeatherEngine, info, Vector } from '@dialthetti/feather-engine-core';
import { EntityPrefab } from '@dialthetti/feather-engine-entities';
import { Activatable, Context, Overlappable, TraitAdapter } from '../../../core/entities';
import { TouchableEntity } from './touchable-entity';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import PlatformerEntity from '../../../extension/platformer/entities/platformer-entity';

import { TransitionEvent } from '../../../core/scenes';

export class TransitionPrefab extends EntityPrefab {
  constructor() {
    super('transition');
    this.size = new Vector(16, 32);
    this.offset = new Vector(0, 0);
    this.traits = (): TraitAdapter[] => [
      new Overlappable(),
      new Activatable((entity: TouchableEntity, context: Context) => {
        const onTouch = TransitionPrefab.getProperties(entity)['onTouch'];
        if (!onTouch) {
          const target = TransitionPrefab.getProperties(entity)['target'];
          const [levelName, x, y] = target.split(':');
          FeatherEngine.eventBus.publish(
            new TransitionEvent({ levelName, position: new Vector(parseInt(x) * 16 - 16, parseInt(y) * 16 - 32) })
          );
        }
      }),
      new TransitionArea(),
    ];
  }
  entityFac = (): TouchableEntity => {
    const e = new TouchableEntity();
    return e;
  };

  flipped(): boolean {
    return false;
  }

  routeFrame(entity: TouchableEntity, sprite: SpriteSheet): string {
    return '';
  }

  static getProperties(entity: PlatformerEntity): {
    onTouch: boolean;
    target: string;
  } {
    return { onTouch: false, target: 'forest:105.52', ...entity.properties };
  }
}

export class TransitionArea extends TraitAdapter {
  active = false;
  constructor() {
    super('transition');
  }

  update(entity: TouchableEntity, context: Context): void {
    if (this.active) {
      return;
    }
    const overLappable = entity.getTrait(Overlappable);
    const onTouch = TransitionPrefab.getProperties(entity)['onTouch'];
    if (overLappable.overLappingWithPlayer(entity) && onTouch) {
      this.active = true;
      const target = TransitionPrefab.getProperties(entity)['target'];
      const [levelName, x, y] = target.split(':');
      FeatherEngine.eventBus.publish(
        new TransitionEvent({ levelName, position: new Vector(parseInt(x) * 16 - 16, parseInt(y) * 16 - 32) })
      );
      // this.active = false;
    }
  }
}
