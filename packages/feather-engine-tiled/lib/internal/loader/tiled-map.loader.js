"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const feather_engine_core_1 = require("@dialthetti/feather-engine-core");
const feather_engine_graphics_1 = require("@dialthetti/feather-engine-graphics");
const polyfill_1 = require("../polyfill");
const tile_matrix_creator_1 = require("./tile-matrix-creator");
const tiled_tileset_loader_1 = require("./tiled-tileset.loader");
class TiledMapLoader {
    constructor(path) {
        this.path = path;
        this.loader = () => (0, feather_engine_core_1.loadJson)(this.path);
        this.tilesetLoader = (tileset, ids) => new tiled_tileset_loader_1.default(this.directory + tileset.source, tileset.firstgid).load();
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.loader();
            return this.map(json);
        });
    }
    map(tmx) {
        return __awaiter(this, void 0, void 0, function* () {
            const w = tmx.tilewidth;
            const h = tmx.tileheight;
            if (w !== h) {
                console.warn('tiles are not squared. May cause issues');
            }
            const ids = this.getUsedTileIds(tmx);
            console.log(`${ids.length} Tiles required for stage`);
            const tilesets = yield Promise.all([...tmx.tilesets].map((tileset) => __awaiter(this, void 0, void 0, function* () { return this.tilesetLoader(tileset, ids); })));
            const tileset = this.merge(tilesets);
            const viewPorts = this.getViewPorts(tmx);
            const entities = this.getEntities(tmx);
            const tiledMap = {
                tileset: tileset.tileset,
                tileSize: w,
                viewPorts,
                entities,
            };
            tiledMap.layers = this.createTileMatrixes(tmx, tileset.tileMatrix);
            if (tmx.infinite) {
                tiledMap.width = tmx.width * tmx.layers[0].width;
                tiledMap.height = tmx.width * tmx.layers[0].height;
            }
            else {
                tiledMap.width = tmx.width;
                tiledMap.height = tmx.height;
            }
            return tiledMap;
        });
    }
    getUsedTileIds(tmx) {
        const x = tmx.layers
            .filter((layer) => layer.visible)
            .filter((layer) => layer.type === 'tilelayer')
            .map((layer) => {
            if ('chunks' in layer) {
                return (0, polyfill_1.distinct)((0, polyfill_1.flatMap)(layer.chunks.map((a) => (0, polyfill_1.distinct)(a.data))));
            }
            if ('data' in layer) {
                return (0, polyfill_1.distinct)(layer.data);
            }
            return [];
        });
        return (0, polyfill_1.distinct)((0, polyfill_1.flatMap)(x));
    }
    getViewPorts(tmx) {
        const x = (0, polyfill_1.flatMap)(tmx.layers
            .filter((layer) => layer.visible)
            .filter((layer) => layer.type === 'objectgroup' && layer.name == 'ViewPorts')
            .map((layer) => layer.objects.map((o) => new feather_engine_core_1.BoundingBox(new feather_engine_core_1.Vector(o.x, o.y), new feather_engine_core_1.Vector(o.width, o.height)))));
        if (x.length == 0) {
            return [
                new feather_engine_core_1.BoundingBox(new feather_engine_core_1.Vector(0, 0), new feather_engine_core_1.Vector(tmx.width * tmx.tilewidth, tmx.height * tmx.tileheight)),
            ];
        }
        return x;
    }
    /**
     * Get all Entities from the EntityLayer. The Entity Layer must be an object layer with the name "Entities"
     * @param tmx
     * @returns entity prefab ids with their position
     */
    getEntities(tmx) {
        const x = (0, polyfill_1.flatMap)(tmx.layers
            .filter((layer) => layer.visible)
            .filter((layer) => layer.type === 'objectgroup' && layer.name == 'Entities')
            .map((layer) => layer.objects
            .map((o) => (Object.assign(Object.assign({}, o), { prefabId: this.getProperty(o.properties, 'entity_prefab') })))
            .filter(({ prefabId }) => prefabId !== undefined)
            .map((o) => ({
            prefab: o.prefabId,
            position: { x: o.x, y: o.y },
            properties: this.toMap(o.properties),
        }))));
        return x;
    }
    toMap(o) {
        const x = {};
        o.forEach((entry) => (x[entry.name] = entry.value));
        return x;
    }
    getProperty(propertyMap, name) {
        return propertyMap
            .filter((p) => p.name == name)
            .map((p) => p.value)
            .pop();
    }
    createTileMatrixes(tmx, tileProps) {
        const tileCreator = new tile_matrix_creator_1.default(tileProps);
        return tmx.layers
            .filter((a) => a.visible)
            .filter((layer) => layer.type === 'tilelayer')
            .map((layer) => ({
            name: layer.name,
            matrix: tileCreator.create(layer),
            frontLayer: this.hasEnabled(layer, 'frontLayer'),
            dynamic: this.hasEnabled(layer, 'dynamic'),
        }));
    }
    hasEnabled(layer, key) {
        return layer && layer.properties.some((t) => t.name === key && t.value === true);
    }
    merge(tilesets) {
        return tilesets.reduce((o, c) => ({
            tileMatrix: Object.assign(Object.assign({}, o.tileMatrix), c.tileMatrix),
            tileset: (0, feather_engine_graphics_1.mergeImageContainer)(o.tileset, c.tileset),
        }));
    }
}
exports.default = TiledMapLoader;
