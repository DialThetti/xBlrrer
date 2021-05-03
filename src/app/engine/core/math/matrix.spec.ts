import Matrix from './matrix';
import { expect } from 'chai';

describe('Vector', () => {
    let matrix: Matrix<number>;
    it('should create an Matrix', () => {
        matrix = new Matrix<number>();
        expect(matrix).to.not.equal(null);
        expect(matrix.grid).to.be.instanceOf(Array);
        expect(matrix.grid).to.have.length(0);
    });
    it('should be able to set a value', () => {
        matrix.set(0, 1, 5);
        expect(matrix.get(0, 1)).to.equal(5);
    });
    it('should be able to get  undefined value', () => {
        expect(matrix.get(1, 1)).to.be.undefined;
        expect(matrix.get(0, 2)).to.be.undefined;
    });
    it('should be able to override value', () => {
        matrix.set(0, 1, 7);
        expect(matrix.get(0, 1)).to.equal(7);
    });
});
