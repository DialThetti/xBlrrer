import { TileSet } from '@dialthetti/feather-engine-graphics';
import { mock } from 'ts-mockito';
import { Layer } from '../model/tiled-map.model';
import { TiledTileset } from '../model/tiled-tileset.model';
import { InfiniteTmxLayer, TmxModel } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TiledMapLoader from './tiled-map.loader';

describe('TiledMapLoader', () => {
  let tiledMapLoader: TiledMapLoader;
  beforeEach(() => {
    tiledMapLoader = new TiledMapLoader('./test-assets/test-tilemap.tmx');
  });
  it('should be created correctly', () => {
    expect(tiledMapLoader).not.toBeUndefined();
    expect(tiledMapLoader.directory).toEqual('./test-assets/');
  });
  describe('load', () => {
    let layers: Layer;
    let tileset: TileSet;
    beforeEach(() => {
      tiledMapLoader.loader = mockLoader<TmxModel<InfiniteTmxLayer>>({
        infinite: true,
        tilesets: [{ firstgid: 0, source: 'a' }],
        layers: [{ width: 0, height: 0 }],
      } as unknown as TmxModel<InfiniteTmxLayer>);
      tileset = mock<TileSet>();
      tiledMapLoader.tilesetLoader = mockLoader<TiledTileset>({
        tileMatrix: {
          0: {
            id: 0,
            properties: [],
          } as TsxTileModel,
        },
        tileset,
      } as TiledTileset);
      layers = mock<Layer>();
      tiledMapLoader.createTileMatrixes = () => [layers];
    });
    it('should work', async () => {
      const tiledMap = await tiledMapLoader.load();
      expect(tiledMap).not.toBeUndefined();
      expect(tiledMap.layers[0]).toBe(layers);
      expect(tiledMap.tileset).toBe(tileset);
    });
  });
});

function mockLoader<T>(data: T): () => Promise<T> {
  return () => Promise.resolve(data);
}
