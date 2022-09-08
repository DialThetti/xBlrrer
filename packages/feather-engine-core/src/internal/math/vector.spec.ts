import Vector from './vector';

describe('Vector', () => {
  let vector: Vector;
  it('should create an Vector', () => {
    vector = new Vector(0, 0);
    expect(vector).not.toEqual(null);
    expect(vector.x).toEqual(0);
    expect(vector.y).toEqual(0);
  });
  it('should be able to set values', () => {
    vector.set(4, 5);
    expect(vector.x).toEqual(4);
    expect(vector.y).toEqual(5);
  });
  it('should be able to add an Vector', () => {
    vector.add(new Vector(4, 5));
    expect(vector.x).toEqual(8);
    expect(vector.y).toEqual(10);
  });
  it('should be able scaleble', () => {
    const vector2 = vector.getScaledBy(0.5);
    expect(vector.x).toEqual(8);
    expect(vector.y).toEqual(10);
    expect(vector2.x).toEqual(4);
    expect(vector2.y).toEqual(5);
  });
});
