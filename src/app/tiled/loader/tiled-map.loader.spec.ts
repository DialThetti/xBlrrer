import { expect } from 'chai';
import { deepEqual, mock, when } from 'ts-mockito';
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
        beforeEach(() => {
            class X {
                get(): Promise<XMLDocument> {
                    return null;
                }
            }
            const m = mock<XMLDocument>();
            const map = mock<HTMLMapElement>();
            when(map.getAttribute('tilewidth')).thenReturn('1');
            when(m.getElementsByTagName(deepEqual('map'))).thenReturn([map] as any);
            const x = mock(X);
            when(x.get()).thenResolve(m);
            tiledMapLoader.xmlLoader = () => x.get();
        });
        it('should create a TiledMap from file', async () => {
            const map = await tiledMapLoader.load();
            expect(map).not.to.be.undefined;
        });
    });
});
