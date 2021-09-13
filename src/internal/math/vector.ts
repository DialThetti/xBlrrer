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

    static UP = new Vector(0, -1);
    static DOWN = new Vector(0, 1);
    static LEFT = new Vector(-1, 0);
    static RIGHT = new Vector(1, 0);
}
