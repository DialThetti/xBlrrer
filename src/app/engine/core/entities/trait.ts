import { PositionedTile } from '@engine/level/level-layer';
import Collidable from '../physics/collidable';
import Camera from '../world/camera';
import { Side } from '../world/tiles/side';
import Entity from './entity';
import { traitRegistry } from './trait-registry';

/**
 * A Trait is a single property hold by an entity to handle a single behavior like Solidity or Gravity.
 *
 */
export default abstract class Trait {
    enabled = true;

    private finalizeMethod: () => void;
    /**
     * Creating a trait requires a unique name to make it distinct to others. The name should be kebab-case
     * @param name kebab-cased name of the trait. Should be unique for the whole system.
     */
    constructor(public name: string) {
        traitRegistry.addTrait(this);
    }

    /**
     * Called whenever an entity is updated, so the Trait can modify the entity while updating.
     * @param entity the Entity which owns the Trait
     * @param context the Context containing e.g. deltaTime
     */
    update(entity: Entity, context: Context): void {} // eslint-disable-line
    /**
     * Called whenever an entity would collide with a Tile
     * @param entity the Entity which owns the Trait
     * @param side the Side of the Entity which is colliding
     * @param match - The Tile and its Position with which the Entity collided
     */
    obstruct(entity: Entity, side: Side, match: PositionedTile): void {} // eslint-disable-line
    /**
     * Called whenever an entity would collide with another Entity
     * @param entity the Entity which owns the Trait
     * @param target the Entity which was collided with
     */
    collides(entity: Entity, target: Entity): void {} // eslint-disable-line
    /**
     * Called whenever a entity finalizes. Used to register methods which are called once after all Traits where handled.
     * Will be cleaned after usage
     */
    finalize: () => void;
}

export interface Context {
    deltaTime: number;
    camera: Camera;
    collidable: Collidable;
}
