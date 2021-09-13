import { TwoDimTileCollisionHandler } from '@engine/core/physics/collider/tile.collider';
import Killable from '@extension/platformer/entities/traits/killable';
import { Entity } from '@dialthetti/feather-engine-entities';

export function createDeadlyHandler(): TwoDimTileCollisionHandler {
    return {
        x: (entity: Entity): void => {
            const killable = entity.getTrait(Killable);
            killable?.kill();
        },
        y: (entity: Entity): void => {
            const killable = entity.getTrait(Killable);
            killable?.kill();
        },
    };
}
