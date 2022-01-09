import { Entity } from '@dialthetti/feather-engine-entities';
import Level from 'src/app/core/level/level';
import LevelLayer, { PositionedTile } from 'src/app/core/level/level-layer';
import { createPlatformTileHandler } from './handler/platformTile.handler';
import { createSolidTileHandler } from './handler/solidTile.handler';

export interface TwoDimTileCollisionHandler {
    x: (e: Entity, m: PositionedTile, tiles: LevelLayer) => void;
    y: (e: Entity, m: PositionedTile, tiles: LevelLayer) => void;
}

const handlers = {
    solid: createSolidTileHandler(),
    platform: createPlatformTileHandler(),
};

export function addHandler(name: string, handler: TwoDimTileCollisionHandler): void {
    handlers[name] = handler;
}
export default class TileCollider {
    constructor(private level: Level, private tileSize: number) {}

    checkX(entity: Entity): void {
        const box = entity.bounds;
        if (entity.vel.x === 0) {
            return;
        }
        const x = entity.vel.x > 0 ? box.right : box.left;
        for (const resolver of this.level.levelLayer) {
            resolver
                .get({ from: x, to: x }, { from: box.top, to: box.bottom })
                .forEach((match) => this.handle('x', entity, match, resolver));
        }
    }

    checkY(entity: Entity): void {
        const box = entity.bounds;
        if (entity.vel.y === 0) {
            return;
        }
        const y = entity.vel.y > 0 ? box.bottom : box.top;
        for (const resolver of this.level.levelLayer) {
            resolver
                .get({ from: box.left, to: box.right }, { from: y, to: y })
                .forEach((match) => this.handle('y', entity, match, resolver));
        }
    }

    handle(dimension: 'x' | 'y', entity: Entity, match: PositionedTile, tiles: LevelLayer): void {
        if (!match.tile.types) {
            return;
        }
        match.tile.types.forEach((e) => {
            const h = handlers[e];
            if (h) {
                h[dimension](entity, match, tiles);
            }
        });
    }
}
