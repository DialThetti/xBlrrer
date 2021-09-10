import EntityCollider from '@engine/core/physics/collider/entity.collider';
import TileCollider from '@engine/core/physics/collider/tile.collider';
import { Entity } from 'feather-engine-entities';
import PlatformerLevel from './level';

export default class LevelCollider {
    private tileCollider: TileCollider;
    private entityCollider: EntityCollider;

    constructor(level: PlatformerLevel) {
        this.entityCollider = new EntityCollider(level.entities);
        this.tileCollider = new TileCollider(level, level.tilesize);
    }

    checkX(entity: Entity): void {
        this.tileCollider.checkX(entity);
    }
    checkY(entity: Entity): void {
        this.tileCollider.checkY(entity);
    }

    check(entity: Entity): void {
        this.entityCollider.check(entity);
    }
}
