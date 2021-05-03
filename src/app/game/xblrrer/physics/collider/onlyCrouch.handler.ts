import { TwoDimTileCollisionHandler } from '@engine/core/physics/collider/tile.collider';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Crouch from '../../entities/traits/crouch';

export function createOnlyCrouchTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (): void => {
            // no collision in x direction
        },
        y: (entity: PlatformerEntity): void => {
            const crouch = entity.getTrait(Crouch);
            if (crouch) {
                crouch.lockDown = true;
            }
        },
    };
}
