import { mock, spy, verify } from 'ts-mockito';
import Font from '../font';
import FontLoader from './font.loader';

describe('FontLoader', () => {
  let fontLoader: FontLoader;
  const fontSpriteSheet: Font = mock(Font);

  beforeEach(() => {
    fontLoader = new FontLoader('http://localhost/font');
    fontLoader['loadImage'] = async () => new Promise(e => e({ width: 16 * 8 } as HTMLImageElement));
    fontLoader['createNewFont'] = () => fontSpriteSheet;
  });

  it('should load a font', async done => {
    const fontSpy = spy(fontSpriteSheet);
    const font = await fontLoader.load();
    expect(font).toBe(fontSpriteSheet);
    verify(fontSpy.define(' ', 0, 0, 8, 8)).once();
    verify(fontSpy.define('9', 72, 8, 8, 8)).once();
    done();
  });
});
