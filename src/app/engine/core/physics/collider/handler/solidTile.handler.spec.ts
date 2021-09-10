import { Vector } from 'feather-engine-core';
import { Entity, Side } from 'feather-engine-entities';
import { anything, spy, verify } from 'ts-mockito';
import LevelLayer, { PositionedTile } from '../../../../level/level-layer';
import { createSolidTileHandler } from './solidTile.handler';

describe('createSolidTileHandler', () => {
    const handler = createSolidTileHandler();
    let entity;
    let spyedInstance;
    beforeEach(() => {
        entity = {
            obstruct: () => {
                /* noop */
            },
            bounds: { left: -1, right: 1, bottom: 1, top: -1 },
        } as unknown as Entity;
        spyedInstance = spy(entity);
    });
    it('should create a handler', () => {
        expect(handler).not.toBeNull();
    });
    describe('x', () => {
        it('should do nothing if x == 0', () => {
            entity.vel = new Vector(0, 0);
            handler.x(entity, {} as PositionedTile, {} as LevelLayer);
            verify(spyedInstance.obstruct(anything(), anything())).never();
        });
        it('should obstruct RIGHT if x > 0', () => {
            entity.vel = new Vector(1, 0);
            handler.x(entity, { x: { from: -1 } } as PositionedTile, {} as LevelLayer);
            verify(spyedInstance.obstruct(Side.RIGHT, anything())).once();
        });
        it('should obstruct LEFT if x < 0', () => {
            entity.vel = new Vector(-1, 0);
            handler.x(entity, { x: { to: 1 } } as PositionedTile, {} as LevelLayer);
            verify(spyedInstance.obstruct(Side.LEFT, anything())).once();
        });
    });
    describe('y', () => {
        it('should do nothing if y == 0', () => {
            entity.vel = new Vector(0, 0);
            handler.y(entity, {} as PositionedTile, {} as LevelLayer);
            verify(spyedInstance.obstruct(anything(), anything())).never();
        });
        it('should obstruct BOTTOM if y > 0', () => {
            entity.vel = new Vector(0, 1);
            handler.y(entity, { y: { from: -1 } } as PositionedTile, {} as LevelLayer);
            verify(spyedInstance.obstruct(Side.BOTTOM, anything())).once();
        });
        it('should obstruct TOP if y < 0', () => {
            entity.vel = new Vector(0, -1);
            handler.y(entity, { y: { to: 1 } } as PositionedTile, {} as LevelLayer);
            verify(spyedInstance.obstruct(Side.TOP, anything())).once();
        });
    });
});
