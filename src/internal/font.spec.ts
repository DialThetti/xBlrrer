import { Canvas, RenderContext } from '@dialthetti/feather-engine-core';
import { mock } from 'ts-mockito';
import Font from './font';
describe('Font', () => {
    let args: any[][] = [];
    let renderContext: RenderContext;
    let font: Font;
    beforeEach(() => {
        args = [];
        renderContext = {
            drawImage: (c: HTMLCanvasElement, ...a: number[]) => null,
        } as unknown as RenderContext;
        const img = mock<Canvas>();
        font = new Font(img, 10, 10);
        font.draw = (...a) => args.push(a);
    });
    it('should print text', () => {
        font.print('abc', renderContext, 5, 5);
        expect(args.length).toBe(3);
        expect(args[0]).toStrictEqual(['a', renderContext, 5, 5]);
        expect(args[1]).toStrictEqual(['b', renderContext, 5 + 8, 5]);
        expect(args[2]).toStrictEqual(['c', renderContext, 5 + 8 + 8, 5]);
    });
});
