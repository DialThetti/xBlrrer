import { Entity } from '@dialthetti/feather-engine-entities';
import { Killable } from '@game/entities/traits';
import { TwoDimTileCollisionHandler } from 'src/app/core/physics';

export const createDeadlyHandler = (): TwoDimTileCollisionHandler => {
  return {
    x: (entity: Entity): void => {
      const killable = entity.getTrait(Killable);
      killable?.kill();
    },
    y: (entity: Entity): void => {
      const killable = entity.getTrait(Killable);
      killable?.kill();
    },
  };
};
