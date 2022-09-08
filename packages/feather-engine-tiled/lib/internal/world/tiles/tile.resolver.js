"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tile_math_1 = require("./tile.math");
class TileResolver {
    constructor(tiles, tilesize) {
        this.tiles = tiles;
        this.math = new tile_math_1.default(tilesize);
    }
}
exports.default = TileResolver;
