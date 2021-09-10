import { PositionedTile } from '@engine/level/level-layer';
import { Entity, Side } from 'feather-engine-entities';
import { TwoDimTileCollisionHandler } from '../tile.collider';

export function createSolidTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: Entity, match: PositionedTile): void => {
            if (entity.vel.x === 0) {
                return;
            }
            if (entity.vel.x > 0) {
                if (entity.bounds.right > match.x.from) {
                    entity.obstruct(Side.RIGHT, match);
                }
            } else {
                if (entity.bounds.left < match.x.to) {
                    entity.obstruct(Side.LEFT, match);
                }
            }
        },
        y: (entity: Entity, match: PositionedTile): void => {
            if (entity.vel.y === 0) {
                return;
            }
            if (entity.vel.y > 0) {
                if (entity.bounds.bottom > match.y.from) {
                    entity.obstruct(Side.BOTTOM, match);
                }
            } else {
                if (entity.bounds.top < match.y.to) {
                    entity.obstruct(Side.TOP, match);
                }
            }
        },
    };
}
