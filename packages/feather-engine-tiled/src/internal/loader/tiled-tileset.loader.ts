import { Canvas, Loader, loadImage, loadJson } from '@dialthetti/feather-engine-core';
import { createAnim, TileSet } from '@dialthetti/feather-engine-graphics';
import { TiledTileset } from '../model/tiled-tileset.model';
import { TsxModel, TsxTileModel } from '../model/tsx.model';
export default class TiledTilesetLoader implements Loader<TiledTileset> {
  directory: string;
  onlyRequiredIds?: number[];
  loader = (): Promise<TsxModel> => loadJson<TsxModel>(this.path);
  imageLoader = (path: string): Promise<Canvas> => loadImage(path);
  createTileSet = (img: Canvas, tsxModel: TsxModel): TileSet =>
    new TileSet(img, tsxModel.tilewidth, tsxModel.tileheight);

  constructor(private path: string, private idOffset: number) {
    this.directory = path.substr(0, this.path.lastIndexOf('/') + 1);
  }

  filteredBy(ids: number[]): TiledTilesetLoader {
    this.onlyRequiredIds = ids;
    return this;
  }

  async load(): Promise<TiledTileset> {
    const tsxModel = await this.loader();

    const img = await this.imageLoader(this.directory + tsxModel.image);
    const tileset = this.createTileSet(img, tsxModel);
    const tileMatrix: { [id: number]: TsxTileModel } = {};
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
        const animation: {
          duration: number;
          tileid: number;
        }[] = tsxModel.tiles[index]?.animation ?? [];
        if (animation.length != 0) {
          console.debug('add 1 animation ' + id);
          tileset.defineAnim(
            `${id}`,
            createAnim(
              animation.map(a => '' + (a.tileid + this.idOffset)),
              animation[0].duration / 1000,
              true
            )
          );
        }
      }
    }
    return { tileset, tileMatrix };
  }
}
