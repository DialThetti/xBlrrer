import { cross, intRange } from './math';
import { expect } from 'chai';
import BoundingBox from './boundingBox';
import Vector from './vector';

describe('BoundingBox', () => {
    let box: BoundingBox;
    it('should be created', () => {
        box = new BoundingBox(new Vector(0, 1), new Vector(1, 2), new Vector(2, 3));
        expect(box).to.be.not.null;
    });
    it('should have a top', () => {
        expect(box.top).to.equal(4);
    });
    it('should have a bottom', () => {
        expect(box.bottom).to.equal(6);
    });
    it('should have a left', () => {
        expect(box.left).to.equal(2);
    });
    it('should have a right', () => {
        expect(box.right).to.equal(3);
    });

    it('should set a top', () => {
        box.top = 8;
        expect(box.top).to.equal(8);
    });
    it('should set a bottom', () => {
        box.bottom = 8;
        expect(box.bottom).to.equal(8);
    });
    it('should set a left', () => {
        box.left = 8;
        expect(box.left).to.equal(8);
    });
    it('should set a right', () => {
        box.right = 8;
        expect(box.right).to.equal(8);
    });
    it('should verify overlaps', () => {
        expect(box.overlaps(box)).to.be.true;
        expect(box.overlaps(new BoundingBox(new Vector(0, 0), new Vector(1, 2), new Vector(2, 3)))).to.be.false;
    });
});
