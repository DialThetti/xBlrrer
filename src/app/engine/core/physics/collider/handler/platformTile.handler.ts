import { PositionedTile } from '@engine/level/level-layer';
import { Entity, Side } from '@dialthetti/feather-engine-entities';
import { TwoDimTileCollisionHandler } from '../tile.collider';

export function createPlatformTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (): void => {
            // platforms do not collide vertically
        },
        y: (entity: Entity, match: PositionedTile): void => {
            if (entity.bypassPlatform) return;
            if (entity.vel.y > 0) {
                if (entity.bounds.bottom > match.y.from) {
                    entity.obstruct(Side.BOTTOM, match);
                }
            }
        },
    };
}
