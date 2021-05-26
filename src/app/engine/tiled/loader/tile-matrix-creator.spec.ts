import { InfiniteTmxLayer } from '../model/tmx.model';
import { TsxTileModel } from '../model/tsx.model';
import TileMatrixCreator from './tile-matrix-creator';
describe('TileMatrixCreator', () => {
    let tileMatrixCreator: TileMatrixCreator;
    beforeEach(() => {
        const tileProps = {
            1: {
                id: 1,
                properties: [{ name: 'solid', type: 'boolean', value: true }],
            } as TsxTileModel,
            2: {
                id: 2,
                properties: [
                    { name: 'other', type: 'string', value: 'respawn' },
                    { name: 'solid', type: 'boolean', value: false },
                ],
            } as TsxTileModel,
        };
        tileMatrixCreator = new TileMatrixCreator(tileProps);
    });
    it('should be created', () => {
        expect(tileMatrixCreator).not.toBeUndefined();
    });
    describe('create', () => {
        const layer = {
            chunks: [
                {
                    x: 2,
                    y: 0,
                    width: 3,
                    height: 3,
                    data: [0, 1, 0, 1, 2, 1, 2, 3, 2],
                },
            ],
            id: 0,
            name: 'name',
        } as InfiniteTmxLayer;
        it('should create a matrix out of a layer', () => {
            const matrix = tileMatrixCreator.create(layer);
            expect(matrix).not.toBeNull();
            expect(matrix.get(2, 0)).toBeUndefined();
            expect(matrix.get(3, 0).name).toEqual('1');
            expect(matrix.get(3, 0).types).toContain('solid');
            expect(matrix.get(3, 1).name).toEqual('2');
            expect(matrix.get(3, 1).types).toContain('respawn');
            expect(matrix.get(3, 1).types).not.toContain('solid');
            expect(matrix.get(3, 2).name).toEqual('3');
            expect(matrix.get(3, 2).types.length).toBe(0);
        });
    });
});
