import Entity from '../engine/entities/entity';
import Matrix from '../engine/math/matrix';
import EntityCollider from '../engine/physics/collider/entity.collider';
import TileCollider from '../engine/physics/collider/tile.collider';
import Tile from '../engine/world/tiles/tile';
import Level from './level';

export default class LevelCollider {
    tileCollider: TileCollider;
    entityCollider: EntityCollider;

    constructor(level: Level) {
        this.entityCollider = new EntityCollider(level.entities);
        this.tileCollider = new TileCollider(level.tilesize);
    }

    checkX(entity: Entity): void {
        this.tileCollider.checkX(entity);
    }
    checkY(entity: Entity): void {
        this.tileCollider.checkY(entity);
    }

    set tiles(tiles: Matrix<Tile>) {
        this.tileCollider.addGrid(tiles);
    }
}
