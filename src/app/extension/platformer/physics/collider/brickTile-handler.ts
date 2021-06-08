import Entity from '@engine/core/entities/entity';
import { TwoDimTileCollisionHandler } from '@engine/core/physics/collider/tile.collider';
import { Side } from '@engine/core/world/tiles/side';
import LevelLayer, { PositionedTile } from '@engine/level/level-layer';

export function createBrickTileHandler(): TwoDimTileCollisionHandler {
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
        y: (entity: Entity, match: PositionedTile, tiles: LevelLayer): void => {
            if (entity.vel.y > 0) {
                if (entity.bounds.bottom > match.y.from) {
                    entity.obstruct(Side.BOTTOM, match);
                }
            } else if (entity.vel.y < 0) {
                if (entity.bounds.top < match.y.to) {
                    entity.obstruct(Side.TOP, match);

                    tiles.setByRange(match.x, match.y, undefined);
                }
            }
        },
    };
}
