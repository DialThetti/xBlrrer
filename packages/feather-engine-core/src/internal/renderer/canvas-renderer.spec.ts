import { mock, when } from 'ts-mockito';
import { CanvasRenderer } from './canvas-renderer';
describe('CanvasRenderer', () => {
    let canvasRenderer: CanvasRenderer;
    let context: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    beforeEach(() => {
        context = mock<CanvasRenderingContext2D>();
        when(context.canvas).thenReturn(canvas);
        canvas = { getContext: (s: '2d') => context } as HTMLCanvasElement;
        document.getElementById = () => canvas;
        document.createElement = (string: 'canvas') => canvas;
        canvasRenderer = new CanvasRenderer({ canvasId: 'foo' });
    });
    it('should be created', () => {
        expect(canvasRenderer).not.toBeNull();
    });

    it('should return context', () => {
        expect(canvasRenderer.context).toBe(context);
    });

    describe('createRenderContext', () => {
        it('should return a context', () => {
            const renderContext = CanvasRenderer.createRenderContext(5, 5);
            expect(renderContext).toBe(context);
            expect(canvas.width).toBe(5);
            expect(canvas.height).toBe(5);
        });
    });
});
