"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFiniteLayer = exports.isInfiniteLayer = void 0;
function isInfiniteLayer(layer) {
    return 'chunks' in layer;
}
exports.isInfiniteLayer = isInfiniteLayer;
function isFiniteLayer(layer) {
    return 'data' in layer;
}
exports.isFiniteLayer = isFiniteLayer;
