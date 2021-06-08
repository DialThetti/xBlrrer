import { CanvasRenderer, FeatherEngine, RenderContext } from 'feather-engine-core';
import { mock } from 'ts-mockito';
import TileSet from './tile-set';

describe('TileSet', () => {
    let tileSet: TileSet;
    let img = mock(HTMLImageElement);

    let renderContext: RenderContext;
    let args: number[] = [];
    beforeEach(() => {
        args = [];
        renderContext = {
            scale: (x: number, y: number) => null,
            translate: (x: number, y: number) => null,
            drawImage: (c: HTMLCanvasElement, ...a: number[]) => (args = a),
            canvas: () => ({}),
            clearRect: (x: number, y: number, w: number, h: number) => null,
        } as unknown as RenderContext;
        CanvasRenderer.createRenderContext = (w, h) => renderContext;
        tileSet = new TileSet(img, 10, 10);
    });
    describe('defineTile', () => {
        it('should define a tile', () => {
            tileSet.defineTile('a', 2, 0);
            expect(Object.keys(tileSet.ref[0].pos).length).toBe(1);
            expect(tileSet.ref[0].pos['a']).toBeTruthy();
            expect(tileSet.ref[0].pos['a']).toStrictEqual({ height: 10, width: 10, x: 20, y: 0 });
        });
    });
    describe('drawTile', () => {
        it('should render', () => {
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = true);
            tileSet.ref[0].pos['a'] = {} as any;
            tileSet.drawTile('a', renderContext, 0, 0);
            expect(a).toBeTruthy();
        });
        it('should not render if img not exist', () => {
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = false);
            renderContext.clearRect = (c, x, y) => (a = true);
            tileSet.drawTile('b', renderContext, 0, 0);
            expect(a).toBeTruthy();
        });
        it('should render debug Rect if img not exist', () => {
            FeatherEngine.debugSettings.enabled = true;
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = false);
            renderContext.fillRect = (x, y, w, h) => (a = true);
            tileSet.drawTile('b', renderContext, 0, 0);
            expect(a).toBeTruthy();
        });
    });
    describe('isAnimatedTile', () => {
        it('should return true if tile is animated', () => {
            tileSet.animations['a'] = () => 'a';
            expect(tileSet.isAnimatedTile('a')).toBeTruthy();
        });
        it('should return false if tile is not animated', () => {
            tileSet.animations['b'] = () => 'a';
            expect(tileSet.isAnimatedTile('a')).toBeFalsy();
        });
    });
    describe('drawAnim', () => {
        it('should render a animated tile', () => {
            let a = false;
            tileSet.animations['a'] = () => 'a';
            renderContext.drawImage = (c, x, y) => (a = true);
            tileSet.ref[0].pos['a'] = {} as any;
            tileSet.drawAnim('a', renderContext, 0, 0, 0);
            expect(a).toBeTruthy();
        });
    });
});
