import Range from '../../math/range.interface';

export default class TileMath {
    constructor(private tilesize: number) {}

    toIndex(pos: number): number {
        return Math.floor(pos / this.tilesize);
    }

    toIndexRange(r: Range): number[] {
        const pMax = Math.ceil(r.to / this.tilesize) * this.tilesize;
        const range = [];
        let pos = r.from;
        do {
            range.push(this.toIndex(pos));
            pos += this.tilesize;
        } while (pos < pMax);
        return range;
    }
}
