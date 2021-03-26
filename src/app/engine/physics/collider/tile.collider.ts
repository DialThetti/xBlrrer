import Entity from '../../entities/entity';
import Matrix from '../../math/matrix';
import Tile from '../../world/tiles/tile';
import { createPlatformTileHandler } from './handler/platformTile.handler';
import { createSolidTileHandler } from './handler/solidTile.handler';
import TileColliderLayer, { PositionedTile } from './tile.collider.layer';

export type TwoDimTileCollisionHandler = {
    x: (e: Entity, m: PositionedTile, tiles: TileColliderLayer) => void;
    y: (e: Entity, m: PositionedTile, tiles: TileColliderLayer) => void;
};

const handlers = {
    solid: createSolidTileHandler(),
    platform: createPlatformTileHandler(),
};

export function addHandler(name: string, handler: TwoDimTileCollisionHandler): void {
    handlers[name] = handler;
}
export default class TileCollider {
    layers: TileColliderLayer[];
    constructor(private tileSize: number) {
        this.layers = [];
    }

    addGrid(tiles: Matrix<Tile>): void {
        this.layers.push(new TileColliderLayer(tiles, this.tileSize));
    }

    checkX(entity: Entity): void {
        const box = entity.bounds;
        if (entity.vel.x === 0) {
            return;
        }
        const x = entity.vel.x > 0 ? box.right : box.left;
        for (const resolver of this.layers) {
            const matches = resolver.getByRange({ from: x, to: x }, { from: box.top, to: box.bottom });
            if (!matches) {
                continue;
            }
            matches.forEach((match) => this.handle('x', entity, match, resolver));
        }
    }

    checkY(entity: Entity): void {
        const box = entity.bounds;
        if (entity.vel.y === 0) {
            return;
        }
        const y = entity.vel.y > 0 ? box.bottom : box.top;
        for (const resolver of this.layers) {
            const matches = resolver.getByRange({ from: box.left, to: box.right }, { from: y, to: y });
            if (!matches) {
                continue;
            }
            matches.forEach((match) => this.handle('y', entity, match, resolver));
        }
    }

    handle(dimension: 'x' | 'y', entity: Entity, match: PositionedTile, tiles: TileColliderLayer): void {
        match.tile.types.forEach((e) => {
            const h = handlers[e];
            if (h) {
                h[dimension](entity, match, tiles);
            }
        });
    }
}
