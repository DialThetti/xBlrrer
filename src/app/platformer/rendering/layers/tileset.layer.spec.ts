import { expect } from 'chai';
import { deepEqual, mock, when } from 'ts-mockito';
import { debugSettings } from '../../../engine/debug';
import Range from '../../../engine/math/range.interface';
import TileColliderLayer, { PositionedTile } from '../../../engine/physics/collider/tile.collider.layer';
import { Canvas, RenderContext } from '../../../engine/rendering/render.utils';
import TileSet from '../../../engine/rendering/tileSet';
import Tile from '../../../engine/world/tiles/tile';
import Level from '../../level';
import LevelCollider from '../../level.collider';
import TilesetLayer from './tileset.layer';

let canvas: Canvas;
let context: RenderContext;

let renderedTiles: Tile[];
let hitboxes: Tile[];
class TestTilesetLayer extends TilesetLayer {
    constructor(level: Level, tileSet: TileSet) {
        super(level, tileSet);
        renderedTiles = [];
        hitboxes = [];
    }
    createBackgroundLayer(extraSize: number): Canvas {
        return canvas;
    }
    renderTile(tile: Tile, x: number, y: number): void {
        renderedTiles.push(tile);
    }
    renderHitbox(tile: Tile, x: number, y: number): void {
        hitboxes.push(tile);
    }
}

describe('TilesetLayer', () => {
    let tilesetLayer;
    let level: Level;
    let tileSet: TileSet;
    const layers: TileColliderLayer[] = [];

    beforeEach(() => {
        level = mock<Level>();
        canvas = mock<Canvas>();
        context = mock<RenderContext>();
        when(canvas.getContext(deepEqual('2d'))).thenReturn(context);
        level.collider = { tileCollider: { layers } } as LevelCollider;
        level.tilesize = 3;
        tileSet = mock<TileSet>();
        tilesetLayer = new TestTilesetLayer(level, tileSet);
    });
    it('should be created', () => {
        expect(tilesetLayer).not.to.be.undefined;
        expect(tilesetLayer.buffer).not.to.be.undefined;
    });

    describe('toRange', () => {
        it('should calculate range based on tilesize', () => {
            const r = tilesetLayer.toRange(4, 3);
            expect(r.from).to.equal(1);
            expect(r.to).to.equal(2);
        });
    });

    describe('hasChanged', () => {
        beforeEach(() => {
            tilesetLayer.screenFrameTileRangeHash = '{"rangeX":{"from":0,"to":1},"rangeY":{"from":2,"to":3}}';
        });
        it('should return false if same range', () => {
            const r = tilesetLayer.hasChanged({ from: 0, to: 1 } as Range, { from: 2, to: 3 } as Range);
            expect(r).to.be.false;
        });
        it('should return true if not same range and update hash', () => {
            const r = tilesetLayer.hasChanged({ from: 0, to: 0 } as Range, { from: 2, to: 3 } as Range);
            expect(r).to.be.true;
            expect(tilesetLayer.screenFrameTileRangeHash).to.equal(
                '{"rangeX":{"from":0,"to":0},"rangeY":{"from":2,"to":3}}',
            );
        });
    });
    describe('renderLayer', () => {
        it('should render tiles on layer', () => {
            const tile = {} as Tile;
            const layer = {
                getByIndex(x: number, y: number): PositionedTile {
                    if (x == 0 && y == 1) return { tile } as PositionedTile;
                    return undefined;
                },
            } as TileColliderLayer;
            tilesetLayer.renderLayer(layer, { from: 0, to: 1 }, { from: 0, to: 1 });
            expect(renderedTiles.length).to.equal(1);
            expect(hitboxes.length).to.equal(0);
        });
        it('should render hitboxes if set so', () => {
            const tile = {} as Tile;
            const layer = {
                getByIndex(x: number, y: number): PositionedTile {
                    if (x == 0 && y == 1) return { tile } as PositionedTile;
                    return undefined;
                },
            } as TileColliderLayer;
            debugSettings.hitboxesOnly = true;
            tilesetLayer.renderLayer(layer, { from: 0, to: 1 }, { from: 0, to: 1 });
            expect(renderedTiles.length).to.equal(0);
            expect(hitboxes.length).to.equal(1);
            debugSettings.hitboxesOnly = false;
        });
    });
});
