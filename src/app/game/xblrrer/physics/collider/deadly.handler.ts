import { TwoDimTileCollisionHandler } from '@engine/core/physics/collider/tile.collider';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Killable from '@extension/platformer/entities/traits/killable';

export function createDeadlyHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: PlatformerEntity): void => {
            const killable = entity.getTrait(Killable);
            killable?.kill();
        },
        y: (entity: PlatformerEntity): void => {
            const killable = entity.getTrait(Killable);
            killable?.kill();
        },
    };
}
