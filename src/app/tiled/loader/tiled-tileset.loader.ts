import Loader from '../../engine/io/loader';
import { loadImage, loadJson } from '../../engine/io/loaders';
import TileSet from '../../engine/rendering/tileSet';
import { TiledTile, TiledTileSet } from '../model/tiled-tile-set.model';

export default class TiledTilesetLoader
    implements Loader<{ spriteSheet: TileSet; tileMatrix: { [id: number]: TiledTile } }> {
    directory: string;

    constructor(private path: string, private idOffset: number) {
        this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
    }

    async load(): Promise<{ spriteSheet: TileSet; tileMatrix: { [id: number]: TiledTile } }> {
        const tileset = await loadJson<TiledTileSet>(this.path);

        const img = await loadImage(this.directory + tileset.image);
        const spriteSheet = new TileSet(img, tileset.tilewidth, tileset.tileheight);
        const tileMatrix: { [id: number]: TiledTile } = {};
        for (let index = 0; index < tileset.tilecount; index++) {
            const x = index % tileset.columns;
            const y = Math.floor(index / tileset.columns);
            spriteSheet.defineTile(`${index + this.idOffset}`, x, y);
            if (tileset.tiles) tileMatrix[index + this.idOffset] = tileset.tiles[index];
        }
        return { spriteSheet, tileMatrix };
    }
}
