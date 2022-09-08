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
class TiledTilesetLoader {
    constructor(path, idOffset) {
        this.path = path;
        this.idOffset = idOffset;
        this.loader = () => (0, feather_engine_core_1.loadJson)(this.path);
        this.imageLoader = (path) => (0, feather_engine_core_1.loadImage)(path);
        this.createTileSet = (img, tsxModel) => new feather_engine_graphics_1.TileSet(img, tsxModel.tilewidth, tsxModel.tileheight);
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }
    filteredBy(ids) {
        this.onlyRequiredIds = ids;
        return this;
    }
    load() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const tsxModel = yield this.loader();
            const img = yield this.imageLoader(this.directory + tsxModel.image);
            const tileset = this.createTileSet(img, tsxModel);
            const tileMatrix = {};
            for (let index = 0; index < tsxModel.tilecount; index++) {
                const id = index + this.idOffset;
                if (this.onlyRequiredIds && !this.onlyRequiredIds.includes(id)) {
                    continue;
                }
                const x = index % tsxModel.columns;
                const y = Math.floor(index / tsxModel.columns);
                tileset.defineTile(`${id}`, x, y);
                if (tsxModel.tiles) {
                    tileMatrix[index + this.idOffset] = tsxModel.tiles[index];
                    const animation = (_b = (_a = tsxModel.tiles[index]) === null || _a === void 0 ? void 0 : _a.animation) !== null && _b !== void 0 ? _b : [];
                    if (animation.length != 0) {
                        console.debug('add 1 animation ' + id);
                        tileset.defineAnim(`${id}`, (0, feather_engine_graphics_1.createAnim)(animation.map((a) => '' + (a.tileid + this.idOffset)), animation[0].duration / 1000, true));
                    }
                }
            }
            return { tileset, tileMatrix };
        });
    }
}
exports.default = TiledTilesetLoader;
