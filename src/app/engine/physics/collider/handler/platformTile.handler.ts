import Entity from '../../../entities/entity';
import { Side } from '../../../world/tiles/side';
import { PositionedTile } from '../tile.collider.layer';
import { TwoDimTileCollisionHandler } from '../tile.collider';

export function createPlatformTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (): void => {},
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
