import { CanvasRenderer, FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { mock } from 'ts-mockito';
import SpriteSheet from './sprite-sheet';

describe('SpriteSheet', () => {
  let spriteSheet: SpriteSheet;
  const mockImg = mock(HTMLImageElement);

  let renderContext: RenderContext;
  beforeEach(() => {
    renderContext = {
      scale: () => null,
      translate: () => null,
      drawImage: () => null,
      canvas: () => ({}),
      clearRect: () => null,
    } as unknown as RenderContext;
    CanvasRenderer.createRenderContext = () => renderContext;
    spriteSheet = new SpriteSheet(mockImg, 10, 10);
  });
  describe('define', () => {
    it('should define a sprite', () => {
      spriteSheet.define('a', 0, 0, 10, 10);
      expect(Object.keys(spriteSheet.ref[0]).length).toBe(2);
      expect(spriteSheet.ref[0].pos['a']).toBeTruthy();
      expect(spriteSheet.ref[1].pos['a_switched']).toBeTruthy();
    });
  });
  describe('draw', () => {
    it('should render original', () => {
      let a = false;
      renderContext.drawImage = () => (a = true);
      spriteSheet.ref[0].pos['a'] = {} as any;
      spriteSheet.draw('a', renderContext, 0, 0, false);
      expect(a).toBeTruthy();
    });
    it('should render switched', () => {
      let a = false;
      renderContext.drawImage = () => (a = true);
      spriteSheet.ref[1].pos['a_switched'] = {} as any;
      spriteSheet.draw('a', renderContext, 0, 0, true);
      expect(a).toBeTruthy();
    });
    it('should not render if img not exist', () => {
      let a = false;
      renderContext.drawImage = () => (a = false);
      renderContext.clearRect = () => (a = true);
      spriteSheet.draw('b', renderContext, 0, 0, false);
      expect(a).toBeTruthy();
    });
    it('should render debug Rect if img not exist', () => {
      FeatherEngine.debugSettings.enabled = true;
      let a = false;
      renderContext.drawImage = () => (a = false);
      renderContext.fillRect = () => (a = true);
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
