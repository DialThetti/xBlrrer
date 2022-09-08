import { TileSet } from '@dialthetti/feather-engine-graphics';
import { mock } from 'ts-mockito';
import { TsxModel } from '../model/tsx.model';
import TiledTilesetLoader from './tiled-tileset.loader';

describe('TiledTilesetLoader', () => {
    let tiledTilesetLoader: TiledTilesetLoader;
    beforeEach(() => {
        tiledTilesetLoader = new TiledTilesetLoader('./test-assets/test-tilemap.tsx', 0);
    });
    it('should be created correctly', () => {
        expect(tiledTilesetLoader).not.toBeUndefined();
    });
    describe('load', () => {
        let img;

        beforeEach(() => {
            tiledTilesetLoader.loader = mockLoader<TsxModel>({
                tilecount: 1,
                tiles: [
                    {
                        id: 0,
                        properties: [],
                    },
                ],
            } as unknown as TsxModel);
            img = mock<HTMLImageElement>({} as HTMLImageElement);
            tiledTilesetLoader.imageLoader = mockLoader(img);
            tiledTilesetLoader.createTileSet = () =>
                ({
                    defineTile: () => {
                        /*NOOP*/
                    },
                } as unknown as TileSet);
        });
        it('should work', async () => {
            const tiledTileset = await tiledTilesetLoader.load();
            expect(tiledTileset).not.toBeUndefined();
            expect(tiledTileset.tileset).not.toBeUndefined();
            expect(Object.values(tiledTileset.tileMatrix).length).toEqual(1);
        });
    });
});

function mockLoader<T>(data: T): () => Promise<T> {
    return () => Promise.resolve(data);
}
