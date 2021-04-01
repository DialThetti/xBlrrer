import Entity from '../../../engine/entities/entity';
import { SfxEvent } from '../../../engine/events/events';
import { TwoDimTileCollisionHandler } from '../../../engine/physics/collider/tile.collider';
import TileColliderLayer, { PositionedTile } from '../../../engine/physics/collider/tile.collider.layer';
import Player from '../../entities/traits/player';

function collectCoin(entity: Entity, match: PositionedTile, tiles: TileColliderLayer): void {
    if (entity.hasTrait(Player)) {
        entity.getTrait(Player).coins++;
        tiles.delete(match.x, match.y.from);
        entity.events.emit(new SfxEvent({ name: 'coin', blocking: false }));
    }
}
export function createCoinTileHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: Entity, match: PositionedTile, tiles: TileColliderLayer): void => {
            if (entity.vel.x > 0 && entity.bounds.right > match.x.from) {
                collectCoin(entity, match, tiles);
            }
            if (entity.vel.x < 0 && entity.bounds.left < match.x.to) {
                collectCoin(entity, match, tiles);
            }
        },
        y: (entity: Entity, match: PositionedTile, tiles: TileColliderLayer): void => {
            if (entity.vel.y > 0 && entity.bounds.bottom > match.y.from) {
                collectCoin(entity, match, tiles);
            }
            if (entity.vel.y < 0 && entity.bounds.top < match.y.to) {
                collectCoin(entity, match, tiles);
            }
        },
    };
}
