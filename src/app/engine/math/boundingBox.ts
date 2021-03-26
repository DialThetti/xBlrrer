import Vector from './vector';

export default class BoundingBox {
    constructor(private pos: Vector, private size: Vector, private offset: Vector) {}

    overlaps(box: BoundingBox): boolean {
        return this.bottom > box.top && this.top < box.bottom && this.left < box.right && this.right > box.left;
    }

    get bottom(): number {
        return this.pos.y + this.size.y + this.offset.y;
    }

    set bottom(y: number) {
        this.pos.y = y - (this.size.y + this.offset.y);
    }

    get top(): number {
        return this.pos.y + this.offset.y;
    }

    set top(y: number) {
        this.pos.y = y - this.offset.y;
    }

    get left(): number {
        return this.pos.x + this.offset.x;
    }

    set left(x: number) {
        this.pos.x = x - this.offset.x;
    }

    get right(): number {
        return this.pos.x + this.size.x + this.offset.x;
    }

    set right(x: number) {
        this.pos.x = x - (this.size.x + this.offset.x);
    }
}
