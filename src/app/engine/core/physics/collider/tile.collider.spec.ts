import Matrix from '../../math/matrix';
import Tile from '../../world/tiles/tile';
import TileCollider, { addHandler, TwoDimTileCollisionHandler } from './tile.collider';
import { expect } from 'chai';
import { mock, spy, verify, anything } from 'ts-mockito';
import Entity from '../../entities/entity';
import TileColliderLayer, { PositionedTile } from './tile.collider.layer';

describe('TileCollider', () => {
    let collider: TileCollider;
    beforeEach(() => {
        collider = new TileCollider(3);
    });
    it('should be created', () => {
        expect(collider).not.to.be.null;
        expect(collider.layers.length).to.equal(0);
    });

    describe('addGrid', () => {
        it('should add a layer to the collider', () => {
            collider.addGrid(mock(Matrix));
            expect(collider.layers.length).to.equal(1);
        });
    });
    describe('checkX', () => {
        it('should do nothing if entity is not moving', () => {
            collider.addGrid(mock(Matrix));
            const spyed = spy(collider.layers[0]);

            collider.checkX({ vel: { x: 0 } } as Entity);
            verify(spyed.get(anything(), anything())).never();
        });
        it('should consult layer if entity is moving', () => {
            const m = new Matrix<Tile>();
            m.set(1, 1, { name: 'a', types: [] } as Tile);
            collider.addGrid(m);
            const spyed = spy(collider.layers[0]);
            const spyCollider = spy(collider);
            collider.checkX({ vel: { x: 1 }, bounds: { right: 3, left: -3, top: 3, bottom: -3 } } as Entity);
            verify(spyed.get(anything(), anything())).once();
            verify(spyCollider.handle(anything(), anything(), anything(), anything())).once();
        });
    });
    describe('checkY', () => {
        it('should do nothing if entity is not moving', () => {
            collider.addGrid(mock(Matrix));
            const spyed = spy(collider.layers[0]);

            collider.checkY({ vel: { y: 0 } } as Entity);
            verify(spyed.get(anything(), anything())).never();
        });
        it('should consult layer if entity is moving', () => {
            const m = new Matrix<Tile>();
            m.set(-1, -1, { name: 'a', types: [] } as Tile);
            collider.addGrid(m);
            const spyed = spy(collider.layers[0]);
            const spyCollider = spy(collider);
            collider.checkY({ vel: { y: 1 }, bounds: { right: 3, left: -3, top: 3, bottom: -3 } } as Entity);
            verify(spyed.get(anything(), anything())).once();
            verify(spyCollider.handle(anything(), anything(), anything(), anything())).once();
        });
    });
    describe('handle', () => {
        let spyedInstance;
        beforeEach(() => {
            const m = {
                x: () => {
                    /*noop*/
                },
                y: () => {
                    /*noop*/
                },
            } as TwoDimTileCollisionHandler;
            spyedInstance = spy(m);
            addHandler('rofl', m);
        });
        it('should do nothing if no types are defined for tile', () => {
            collider.handle('x', {} as Entity, { tile: {} as Tile } as PositionedTile, {} as TileColliderLayer);
            verify(spyedInstance.x(anything(), anything(), anything())).never();
            verify(spyedInstance.y(anything(), anything(), anything())).never();
        });
        it('should not notify colliders which not match type', () => {
            collider.handle(
                'x',
                {} as Entity,
                { tile: { types: ['bar'] } as Tile } as PositionedTile,
                {} as TileColliderLayer,
            );
            verify(spyedInstance.x(anything(), anything(), anything())).never();
            verify(spyedInstance.y(anything(), anything(), anything())).never();
        });
        it('should notify colliders which match type and dimension y', () => {
            collider.handle(
                'y',
                {} as Entity,
                { tile: { types: ['rofl'] } as Tile } as PositionedTile,
                {} as TileColliderLayer,
            );
            verify(spyedInstance.x(anything(), anything(), anything())).never();
            verify(spyedInstance.y(anything(), anything(), anything())).once();
        });
        it('should notify colliders which match type and dimension x', () => {
            collider.handle(
                'x',
                {} as Entity,
                { tile: { types: ['rofl'] } as Tile } as PositionedTile,
                {} as TileColliderLayer,
            );
            verify(spyedInstance.x(anything(), anything(), anything())).once();
            verify(spyedInstance.y(anything(), anything(), anything())).never();
        });
    });
});
