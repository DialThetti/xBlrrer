import Vector from './vector';
import { expect } from 'chai';

describe('Vector', () => {
    let vector;
    it('should create an Vector', () => {
        vector = new Vector(0, 0);
        expect(vector).to.not.equal(null);
        expect(vector.x).to.equal(0);
        expect(vector.y).to.equal(0);
    });
    it('should be able to set values', () => {
        vector.set(4, 5);
        expect(vector.x).to.equal(4);
        expect(vector.y).to.equal(5);
    });
    it('should be able to add an Vector', () => {
        vector.add(new Vector(4, 5));
        expect(vector.x).to.equal(8);
        expect(vector.y).to.equal(10);
    });
    it('should be able scaleble', () => {
        const vector2 = vector.getScaledBy(0.5);
        expect(vector.x).to.equal(8);
        expect(vector.y).to.equal(10);
        expect(vector2.x).to.equal(4);
        expect(vector2.y).to.equal(5);
    });
});
