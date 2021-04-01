import { expect } from 'chai';
import Entity from '../../entities/entity';
import Vector from '../../math/vector';
import Solid from './solid';
import { PositionedTile } from '../collider/tile.collider.layer';
import { Side } from '../../world/tiles/side';
import BoundingBox from '../../math/boundingBox';

describe('Solid', () => {
    const trait = new Solid();

    it('should be named "solid"', () => {
        expect(trait.name).to.equal('solid');
    });

    describe('obstruct', () => {
        const entity = {} as Entity;
        const match = { y: { from: 0, to: 2 }, x: { from: 2, to: 4 } } as PositionedTile;
        beforeEach(() => {
            entity.vel = new Vector(4, 2);
            entity.size = new Vector(5, 5);
            entity.bounds = new BoundingBox(new Vector(0, 0), new Vector(2, 2), new Vector(4, 4));
        });

        it('should do nothing if disabled', () => {
            trait.enabled = false;
            trait.obstruct(entity, Side.BOTTOM, match);
            expect(entity.vel.x).to.equal(4);
            expect(entity.vel.y).to.equal(2);
        });
        it('should obstruct BOTTOM', () => {
            trait.enabled = true;
            trait.obstruct(entity, Side.BOTTOM, match);
            expect(entity.vel.x).to.equal(4);
            expect(entity.vel.y).to.equal(0);
            expect(entity.bounds.top).to.equal(-5);
        });
        it('should obstruct TOP', () => {
            trait.enabled = true;
            trait.obstruct(entity, Side.TOP, match);
            expect(entity.vel.x).to.equal(4);
            expect(entity.vel.y).to.equal(0);
            expect(entity.bounds.top).to.equal(2);
        });
        it('should obstruct LEFT', () => {
            trait.enabled = true;
            trait.obstruct(entity, Side.LEFT, match);
            expect(entity.vel.x).to.equal(0);
            expect(entity.vel.y).to.equal(2);
            expect(entity.bounds.left).to.equal(4);
        });
        it('should obstruct RIGHT', () => {
            trait.enabled = true;
            trait.obstruct(entity, Side.RIGHT, match);
            expect(entity.vel.x).to.equal(0);
            expect(entity.vel.y).to.equal(2);
            expect(entity.bounds.left).to.equal(-3);
        });
    });
});
