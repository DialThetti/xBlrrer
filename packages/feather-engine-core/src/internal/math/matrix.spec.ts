import Matrix from './matrix';

describe('Vector', () => {
  let matrix: Matrix<number>;
  it('should create an Matrix', () => {
    matrix = new Matrix<number>();
    expect(matrix).not.toEqual(null);
    expect(matrix.grid).toBeInstanceOf(Array);
    expect(matrix.grid.length).toBe(0);
  });
  it('should be able to set a value', () => {
    matrix.set(0, 1, 5);
    expect(matrix.get(0, 1)).toEqual(5);
  });
  it('should be able to get  undefined value', () => {
    expect(matrix.get(1, 1)).toBeUndefined();
    expect(matrix.get(0, 2)).toBeUndefined();
  });
  it('should be able to override value', () => {
    matrix.set(0, 1, 7);
    expect(matrix.get(0, 1)).toEqual(7);
  });
});
