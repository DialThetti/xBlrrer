import { expect } from 'chai';
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
});
