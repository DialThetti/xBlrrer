import { TwoDimTileCollisionHandler } from '../../../engine/physics/collider/tile.collider';
import TileColliderLayer, { PositionedTile } from '../../../engine/physics/collider/tile.collider.layer';
import EntityImpl from '../../../platformer/entities/entity';
import Crouch from '../../entities/traits/crouch';

export function createOnlyCrouchTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: EntityImpl, match: PositionedTile): void => {},
        y: (entity: EntityImpl, match: PositionedTile, tiles: TileColliderLayer): void => {
            const crouch = entity.getTrait(Crouch);
            if (crouch) {
                crouch.lockDown = true;
            }
        },
    };
}
