import { anyFunction, anyNumber, anything, mock, spy, verify } from 'ts-mockito';
import SpriteSheetModel from '../model/sprite-sheet-model';
import SpriteSheet from '../sprite-sheet';
import SpriteSheetLoader from './sprite-sheet.loader';
describe('SpriteSheetLoader', () => {
    let spriteSheetLoader: SpriteSheetLoader;
    let spriteSheet: SpriteSheet;

    let spriteSpy: SpriteSheet;

    beforeEach(() => {
        spriteSheet = mock(SpriteSheet);
        spriteSheetLoader = new SpriteSheetLoader('http://localhost/font');
        spriteSheetLoader['loadImage'] = async () => new Promise((e) => e({ width: 16 * 8 } as HTMLImageElement));
        spriteSheetLoader['createNewSpriteSheet'] = (img, w, h) => spriteSheet;
        spriteSpy = spy(spriteSheet);
    });

    it('should load a spritesheet', async (done) => {
        spriteSheetLoader['loadSheetSpec'] = async () => new Promise((e) => e({} as SpriteSheetModel));
        const sprite = await spriteSheetLoader.load();
        expect(sprite).toBe(spriteSheet);
        verify(spriteSpy.define(anything(), anyNumber(), anyNumber(), anyNumber(), anyNumber())).never();
        done();
    });
    it('should load a spritesheet with frames', async (done) => {
        spriteSheetLoader['loadSheetSpec'] = async () =>
            new Promise((e) => e({ frames: [{ name: 'a', rect: [0, 0, 0, 0] }] } as SpriteSheetModel));
        const sprite = await spriteSheetLoader.load();
        expect(sprite).toBe(spriteSheet);
        verify(spriteSpy.define('a', 0, 0, 0, 0)).once();
        done();
    });
    it('should load a spritesheet with anim', async (done) => {
        spriteSheetLoader['loadSheetSpec'] = async () =>
            new Promise((e) =>
                e({ animations: [{ name: 'a', frames: ['1', '2', '3'], frameLen: 15 }] } as SpriteSheetModel),
            );
        const sprite = await spriteSheetLoader.load();
        expect(sprite).toBe(spriteSheet);
        verify(spriteSpy.defineAnim('a', anyFunction())).once();
        done();
    });
});
