import { expect } from 'chai';
import { mock } from 'ts-mockito';
import Matrix from '../../engine/math/matrix';
import TileSet from '../../engine/rendering/tileSet';
import Tile from '../../engine/world/tiles/tile';
import { mockLoader } from '../../testing/loader.util';
import { TiledTileset } from '../model/tiled-tileset.model';
import { TmxModel } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TiledMapLoader from './tiled-map.loader';

describe('TiledMapLoader', () => {
    let tiledMapLoader: TiledMapLoader;
    beforeEach(() => {
        tiledMapLoader = new TiledMapLoader('./test-assets/test-tilemap.tmx');
    });
    it('should be created correctly', () => {
        expect(tiledMapLoader).not.to.be.undefined;
        expect(tiledMapLoader.directory).to.equals('./test-assets/');
    });
    describe('load', () => {
        let layers;
        let tileset;
        beforeEach(() => {
            tiledMapLoader.loader = mockLoader<TmxModel>(({
                tilesets: [{ firstgid: 0, source: 'a' }],
            } as unknown) as TmxModel);
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
            layers = mock<Matrix<Tile>>();
            tiledMapLoader.createTileMatrixes = () => [layers];
        });
        it('should work', async () => {
            const tiledMap = await tiledMapLoader.load();
            expect(tiledMap).not.to.be.undefined;
            expect(tiledMap.layers[0]).to.equal(layers);
            expect(tiledMap.tileset).to.equal(tileset);
        });
    });
});
