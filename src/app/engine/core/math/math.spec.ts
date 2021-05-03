import { cross, intRange, random } from './math';
import { expect } from 'chai';

describe('cross', () => {
    it('should return all permutation of elements from 2 input lists', () => {
        const result = cross([0, 1], [2, 3]);

        expect(result).to.deep.equal([
            [0, 2],
            [0, 3],
            [1, 2],
            [1, 3],
        ]);
    });
});

describe('intRange', () => {
    it('should return all numbers from x to y excluding y', () => {
        const result = intRange(0, 1);
        expect(result).to.deep.equal([0]);

        const result2 = intRange(-10, 10);
        expect(result2).does.include(0);
        expect(result2).does.include(-10);
        expect(result2).does.not.include(10);
    });

    it('should return empty array if range is incorrect', () => {
        const result = intRange(0, 0);
        expect(result).to.deep.equal([]);

        const result2 = intRange(0, -5);
        expect(result2).to.deep.equal([]);
    });
});

describe('random', () => {
    it('should return a number smaller than N', () => {
        expect(random(5)).to.be.lessThan(5);
    });
    it('should return a number without digits', () => {
        const n = random(5);
        expect(n).to.equals(Math.floor(n));
    });
});
