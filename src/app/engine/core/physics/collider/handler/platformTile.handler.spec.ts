import { anything, spy, verify } from 'ts-mockito';
import { PositionedTile } from '../../../../level/level-layer';
import Entity from '../../../entities/entity';
import Vector from '../../../math/vector';
import { Side } from '../../../world/tiles/side';
import TileColliderLayer from '../tile.collider.layer';
import { createPlatformTileHandler } from './platformTile.handler';

describe('createPlatformTileHandler', () => {
    const handler = createPlatformTileHandler();
    let entity;
    let spyedInstance;
    beforeEach(() => {
        entity = ({
            obstruct: () => {
                /* noop */
            },
            bounds: { left: -1, right: 1, bottom: 1, top: -1 },
        } as unknown) as Entity;
        spyedInstance = spy(entity);
    });
    it('should create a handler', () => {
        expect(handler).not.toBeNull();
    });
    describe('x', () => {
        it('should do nothing', () => {
            entity.vel = new Vector(0, 0);
            handler.x(entity, {} as PositionedTile, {} as TileColliderLayer);
            verify(spyedInstance.obstruct(anything(), anything())).never();
        });
    });
    describe('y', () => {
        it('should do nothing if y == 0', () => {
            entity.vel = new Vector(0, 0);
            handler.y(entity, {} as PositionedTile, {} as TileColliderLayer);
            verify(spyedInstance.obstruct(anything(), anything())).never();
        });
        it('should obstruct BOTTOM if y > 0', () => {
            entity.vel = new Vector(0, 1);
            handler.y(entity, { y: { from: -1 } } as PositionedTile, {} as TileColliderLayer);
            verify(spyedInstance.obstruct(Side.BOTTOM, anything())).once();
        });
        it('should do nothing if y < 0', () => {
            entity.vel = new Vector(0, -1);
            handler.y(entity, { y: { to: 1 } } as PositionedTile, {} as TileColliderLayer);
            verify(spyedInstance.obstruct(anything(), anything())).never();
        });
    });
});
