import { expect } from 'chai';
import { mock } from 'ts-mockito';
import TileSet from '../../engine/rendering/tileSet';
import { mockLoader } from '../../testing/loader.util';
import { TsxModel } from '../model/tsx.model';
import TiledTilesetLoader from './tiled-tileset.loader';
describe('TiledTilesetLoader', () => {
    let tiledTilesetLoader: TiledTilesetLoader;
    beforeEach(() => {
        tiledTilesetLoader = new TiledTilesetLoader('./test-assets/test-tilemap.tsx', 0);
    });
    it('should be created correctly', () => {
        expect(tiledTilesetLoader).not.to.be.undefined;
    });
    describe('load', () => {
        let img;
        let tileset;

        beforeEach(() => {
            tiledTilesetLoader.loader = mockLoader<TsxModel>(({
                tilecount: 1,
                tiles: [
                    {
                        id: 0,
                        properties: [],
                    },
                ],
            } as unknown) as TsxModel);
            img = mock<HTMLImageElement>({} as HTMLImageElement);
            tiledTilesetLoader.imageLoader = mockLoader(img);
            tiledTilesetLoader.createTileSet = () =>
                (({
                    defineTile: () => {
                        /*NOOP*/
                    },
                } as unknown) as TileSet);
        });
        it('should work', async () => {
            const tiledTileset = await tiledTilesetLoader.load();
            expect(tiledTileset).not.to.be.undefined;
            expect(tiledTileset.tileset).not.to.be.undefined;
            expect(Object.values(tiledTileset.tileMatrix).length).to.equal(1);
        });
    });
});
