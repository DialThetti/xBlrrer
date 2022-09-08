import { RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect } from './helper';

describe('drawRect', () => {
  let args: any[] = [];
  let renderContext: RenderContext;
  beforeEach(() => {
    args = [];
    renderContext = {
      fillRect: (...a: number[]) => (args = ['filled', ...a]),
      rect: (...a: number[]) => (args = ['not_filled', ...a]),
      beginPath: () => null,
      stroke: () => null,
    } as unknown as RenderContext;
  });
  it('should draw a rectangle shape by default', () => {
    drawRect(renderContext, 1, 2, 3, 4, 'blue');
    expect(renderContext.strokeStyle).toEqual('blue');
    expect(args).toStrictEqual(['not_filled', 1, 2, 3, 4]);
  });
  it('should draw a rectangle shape', () => {
    drawRect(renderContext, 1, 2, 3, 4, 'blue', { filled: false });
    expect(renderContext.strokeStyle).toEqual('blue');
    expect(args).toStrictEqual(['not_filled', 1, 2, 3, 4]);
  });
  it('should draw a filled rectangle', () => {
    drawRect(renderContext, 1, 2, 3, 4, 'blue', { filled: true });
    expect(renderContext.fillStyle).toEqual('blue');
    expect(args).toStrictEqual(['filled', 1, 2, 3, 4]);
  });
});
