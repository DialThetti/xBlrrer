import { expect } from 'chai';
import { Layer } from '../model/tiled-map.model';
import { TiledTile } from '../model/tiled-tile-set.model';
import TileMatrixCreator from './tile-matrix-creator';
describe('TileMatrixCreator', () => {
    let tileMatrixCreator: TileMatrixCreator;
    beforeEach(() => {
        const tileProps = {
            1: {
                id: 1,
                properties: [{ name: 'solid', type: 'boolean', value: true }],
            } as TiledTile,
            2: {
                id: 2,
                properties: [
                    { name: 'other', type: 'string', value: 'respawn' },
                    { name: 'solid', type: 'boolean', value: false },
                ],
            } as TiledTile,
        };
        tileMatrixCreator = new TileMatrixCreator(tileProps);
    });
    it('should be created', () => {
        expect(tileMatrixCreator).not.to.be.undefined;
    });
    describe('create', () => {
        const layer: Layer = {
            chunks: [
                {
                    x: 2,
                    y: 0,
                    width: 3,
                    height: 3,
                    elements: [
                        [0, 1, 0],
                        [1, 2, 1],
                        [2, 3, 2],
                    ],
                },
            ],
            id: 0,
            name: 'name',
        };
        it('should create a matrix out of a layer', () => {
            const matrix = tileMatrixCreator.create(layer);
            expect(matrix).not.to.be.null;
            expect(matrix.get(2, 0)).to.be.undefined;
            expect(matrix.get(3, 0).name).to.equal('1');
            expect(matrix.get(3, 0).types).to.contain('solid');
            expect(matrix.get(3, 1).name).to.equal('2');
            expect(matrix.get(3, 1).types).to.contain('respawn');
            expect(matrix.get(3, 1).types).not.to.contain('solid');
            expect(matrix.get(3, 2).name).to.equal('3');
            expect(matrix.get(3, 2).types).to.be.empty;
        });
    });
});
