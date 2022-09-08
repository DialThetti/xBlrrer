"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TileMath {
    constructor(tilesize) {
        this.tilesize = tilesize;
    }
    toIndex(pos) {
        return Math.floor(pos / this.tilesize);
    }
    toIndexRange(r) {
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
exports.default = TileMath;
