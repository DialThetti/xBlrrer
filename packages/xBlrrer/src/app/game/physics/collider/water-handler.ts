import { Entity } from '@dialthetti/feather-engine-entities';
import { Killable } from '@game/entities/traits';
import { TwoDimTileCollisionHandler } from 'src/app/core/physics';

export function createWaterTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: Entity): void => {

            entity.getTrait(Killable)?.kill(1);
        },
        y: (entity: Entity): void => {

            entity.getTrait(Killable)?.kill(1);
        },
    };
}
