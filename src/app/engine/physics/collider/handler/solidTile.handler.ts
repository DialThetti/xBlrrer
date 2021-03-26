import Entity from '../../../entities/entity';
import { Side } from '../../../world/tiles/side';
import { PositionedTile } from '../../../physics/collider/tile.collider.layer';
import { TwoDimTileCollisionHandler } from '../tile.collider';

export function createSolidTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: Entity, match: PositionedTile): void => {
            if (entity.vel.x > 0) {
                if (entity.bounds.right > match.x.from) {
                    entity.obstruct(Side.RIGHT, match);
                }
            } else if (entity.vel.x < 0) {
                if (entity.bounds.left < match.x.to) {
                    entity.obstruct(Side.LEFT, match);
                }
            }
        },
        y: (entity: Entity, match: PositionedTile): void => {
            if (entity.vel.y > 0) {
                if (entity.bounds.bottom > match.y.from) {
                    entity.obstruct(Side.BOTTOM, match);
                }
            } else if (entity.vel.y < 0) {
                if (entity.bounds.top < match.y.to) {
                    entity.obstruct(Side.TOP, match);
                }
            }
        },
    };
}
