export default class Vector {
  constructor(public x: number, public y: number) {}

  add(vec: Vector): void {
    this.x += vec.x;
    this.y += vec.y;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  getScaledBy(n: number): Vector {
    return new Vector(this.x * n, this.y * n);
  }
}
