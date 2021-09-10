import { TwoDimTileCollisionHandler } from '@engine/core/physics/collider/tile.collider';
import { Entity } from 'feather-engine-entities';
import Crouch from '../../entities/traits/crouch';

export function createOnlyCrouchTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (): void => {
            // no collision in x direction
        },
        y: (entity: Entity): void => {
            const crouch = entity.getTrait(Crouch);
            if (crouch) {
                crouch.lockDown = true;
            }
        },
    };
}
