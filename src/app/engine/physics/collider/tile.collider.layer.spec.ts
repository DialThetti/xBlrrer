import Matrix from '../../math/matrix';
import Tile from '../../world/tiles/tile';
import TileColliderLayer from './tile.collider.layer';
import { expect } from 'chai';

describe('TileColliderLayer', () => {
    let layer: TileColliderLayer;

    beforeEach(() => {
        const tiles = new Matrix<Tile>();
        tiles.set(1, 1, new Tile('a', []));
        layer = new TileColliderLayer(tiles, 3);
    });
    it('should be created', () => {
        expect(layer).not.to.be.null;
    });

    describe('get', () => {
        it('should be able to retrieve values for ranges', () => {
            layer.setByRange({ from: 0, to: 9 }, { from: 0, to: 3 }, new Tile('a', []));
            const result = layer.get({ from: 0, to: 9 }, { from: 0, to: 3 });
            expect(result.length).to.equal(3);
        });
        it('should be able to retrieve values for numbers', () => {
            expect(layer.get(3, 3).length).to.equal(1);
            expect(layer.get(6, 6).length).to.equal(0);
        });
        it('should return empty list if nothing found', () => {
            const result = layer.get({ from: 0, to: 3 }, { from: 2, to: 3 });
            expect(result.length).to.equal(0);
        });
    });

    describe('getByIndex', () => {
        it('should be able to retrieve values', () => {
            expect(layer.getByIndex(1, 1)).not.to.be.null;
            expect(layer.getByIndex(2, 2)).to.be.null;
        });
    });

    describe('delete', () => {
        it('should delete a tile by index', () => {
            layer.delete(3, 3);
            expect(layer.getByIndex(1, 1)).to.be.null;
        });
        it('should delete a tile by range', () => {
            layer.setByRange({ from: 0, to: 9 }, { from: 0, to: 3 }, new Tile('a', []));
            layer.delete({ from: 0, to: 9 }, { from: 0, to: 3 });
            const b = layer.get({ from: 0, to: 9 }, { from: 0, to: 3 });
            expect(b.length).to.equal(0);
        });
    });
});
