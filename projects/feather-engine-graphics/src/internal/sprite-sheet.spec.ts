import { CanvasRenderer, FeatherEngine, RenderContext } from 'feather-engine-core';
import { mock, spy } from 'ts-mockito';
import SpriteSheet from './sprite-sheet';

describe('SpriteSheet', () => {
    let spriteSheet: SpriteSheet;
    let img = mock(HTMLImageElement);

    let renderContext: RenderContext;
    let renderContextSpy: RenderContext;
    beforeEach(() => {
        renderContext = {
            scale: (x: number, y: number) => null,
            translate: (x: number, y: number) => null,
            drawImage: (c: HTMLCanvasElement, w: number, h: number) => null,
            canvas: () => ({}),
            clearRect: (x: number, y: number, w: number, h: number) => null,
        } as unknown as RenderContext;
        CanvasRenderer.createRenderContext = (w, h) => renderContext;
        spriteSheet = new SpriteSheet(img, 10, 10);
        renderContextSpy = spy(renderContext);
    });
    describe('define', () => {
        it('should define a sprite', () => {
            spriteSheet.define('a', 0, 0, 10, 10);
            expect(Object.keys(spriteSheet.images).length).toBe(2);
            expect(spriteSheet.images['a']).toBeTruthy();
            expect(spriteSheet.images['a_switched']).toBeTruthy();
        });
    });
    describe('draw', () => {
        it('should render original', () => {
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = true);
            spriteSheet.images['a'] = {} as HTMLCanvasElement;
            spriteSheet.draw('a', renderContext, 0, 0, false);
            expect(a).toBeTruthy();
        });
        it('should render switched', () => {
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = true);
            spriteSheet.images['a_switched'] = {} as HTMLCanvasElement;
            spriteSheet.draw('a', renderContext, 0, 0, true);
            expect(a).toBeTruthy();
        });
        it('should not render if img not exist', () => {
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = false);
            renderContext.clearRect = (c, x, y) => (a = true);
            spriteSheet.draw('b', renderContext, 0, 0, false);
            expect(a).toBeTruthy();
        });
        it('should render debug Rect if img not exist', () => {
            FeatherEngine.debugSettings.enabled = true;
            const img = {} as HTMLCanvasElement;
            let a = false;
            renderContext.drawImage = (c, x, y) => (a = false);
            renderContext.fillRect = (x, y, w, h) => (a = true);
            spriteSheet.draw('b', renderContext, 0, 0, false);
            expect(a).toBeTruthy();
        });
    });
    describe('getAnimation', () => {
        it('should fetch an existing animation', () => {
            spriteSheet.animations['a'] = () => 'a';
            expect(spriteSheet.getAnimation('a')).toBeTruthy();
        });
        it('should get default animation if not exist', () => {
            expect(spriteSheet.getAnimation('a')).toBeTruthy();
            expect(spriteSheet.getAnimation('a')(0)).toBe('');
        });
    });
});
