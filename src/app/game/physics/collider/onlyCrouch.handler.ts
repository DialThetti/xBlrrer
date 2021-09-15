import { Entity } from '@dialthetti/feather-engine-entities';
import { Crouch } from '@game/entities/traits';
import { TwoDimTileCollisionHandler } from 'src/app/core/physics/collider/tile-collider';

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
