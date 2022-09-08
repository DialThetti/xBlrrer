"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feather_engine_core_1 = require("@dialthetti/feather-engine-core");
const tmx_model_1 = require("../model/tmx.model");
const tile_1 = require("../world/tiles/tile");
class TileMatrixCreator {
    constructor(tileProps) {
        this.tileProps = tileProps;
        this.booleanTags = ['solid', 'platform', 'onlyCrouch', 'deadly', 'water'];
    }
    create(layer) {
        const tiles = new feather_engine_core_1.Matrix();
        if ((0, tmx_model_1.isInfiniteLayer)(layer)) {
            this.handleInfiniteLayer(layer, tiles);
        }
        if ((0, tmx_model_1.isFiniteLayer)(layer)) {
            this.handleFiniteLayer(layer, tiles);
        }
        return tiles;
    }
    handleFiniteLayer(layer, tiles) {
        for (let x = 0; x < layer.width; x++) {
            for (let y = 0; y < layer.height; y++) {
                const id = layer.data[y * layer.width + x];
                if (id === 0) {
                    continue;
                }
                this.setTile(tiles, id, this.tileProps[id], x + layer.x, y + layer.y);
            }
        }
    }
    handleInfiniteLayer(layer, tiles) {
        layer.chunks.forEach((chunk) => {
            for (let x = 0; x < chunk.width; x++) {
                for (let y = 0; y < chunk.height; y++) {
                    const id = chunk.data[y * chunk.width + x];
                    if (id === 0) {
                        continue;
                    }
                    this.setTile(tiles, id, this.tileProps[id], x + chunk.x, y + chunk.y);
                }
            }
        });
    }
    setTile(tiles, id, tile, x, y) {
        const tags = this.booleanTags.filter((tag) => this.hasEnabled(tile, tag));
        if (tile && tile.properties.some((t) => t.name === 'other' && t.value.includes('respawn'))) {
            tags.push('respawn');
        }
        tiles.set(x, y, new tile_1.default(`${id}`, tags));
    }
    hasEnabled(tile, key) {
        return tile && tile.properties.some((t) => t.name === key && t.value === true);
    }
}
exports.default = TileMatrixCreator;
