"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledMapLoader = exports.TileMath = exports.Tile = void 0;
const tiled_map_loader_1 = require("./internal/loader/tiled-map.loader");
exports.TiledMapLoader = tiled_map_loader_1.default;
const tile_1 = require("./internal/world/tiles/tile");
exports.Tile = tile_1.default;
const tile_math_1 = require("./internal/world/tiles/tile.math");
exports.TileMath = tile_math_1.default;
__exportStar(require("./internal/model"), exports);
