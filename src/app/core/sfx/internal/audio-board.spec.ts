import { anyNumber, spy, verify } from 'ts-mockito';
import AudioBoard from './audio-board';
describe('AudioBoard', () => {
    let audioBoard: AudioBoard;
    let chain = '';
    let started = false;
    let mockAudioContext = {
        createBufferSource: () => ({
            connect: (node) => {
                chain += 'S';
                return node;
            },
            start: () => (started = true),
        }),
        createGain: () => {
            let x = { gain: { value: 0 }, connect: null };

            x.connect = (node) => {
                chain += 'G' + x.gain.value;
                return node;
            };
            return x;
        },
    } as unknown as AudioContext;
    beforeEach(() => {
        chain = '';
        started = false;
        audioBoard = new AudioBoard(mockAudioContext);
        audioBoard.createPannerNode = (p) =>
            ({
                pan: p,
                connect: (node) => {
                    chain += 'P';
                    return node;
                },
            } as unknown as StereoPannerNode);
    });
    it('shouls be created', () => {
        expect(audioBoard).toBeTruthy();
    });

    describe('addAudio', () => {
        it('should register audio', () => {
            audioBoard.addAudio('a', {} as AudioBuffer);
            expect(Object.keys(audioBoard['buffers'])).toEqual(['a']);
        });
    });
    describe('setSfxVolume', () => {
        it('should set volume in interval 0-1', () => {
            audioBoard.setSfxVolume(0);
            expect(audioBoard['sfxVolume']).toBe(0);
            audioBoard.setSfxVolume(1);
            expect(audioBoard['sfxVolume']).toBe(1);
            audioBoard.setSfxVolume(0.5);
            expect(audioBoard['sfxVolume']).toBe(0.5);
        });
        it('should not overflow', () => {
            audioBoard.setSfxVolume(2);
            expect(audioBoard['sfxVolume']).toBe(1);
        });
        it('should not underflow', () => {
            audioBoard.setSfxVolume(-1);
            expect(audioBoard['sfxVolume']).toBe(0);
        });
    });
    describe('setBgmVolume', () => {
        it('should delegate to layer', () => {
            const s = spy(audioBoard['bgmLayer']);
            audioBoard.setBgmVolume(1);
            verify(s.setVolume(anyNumber())).once();
        });
    });
    describe('setMasterVolume', () => {
        it('should delegate to layer', () => {
            const s = spy(audioBoard['masterAudioLayer']);
            audioBoard.setMasterVolume(1);
            verify(s.setVolume(anyNumber())).once();
        });
    });

    describe('playSfx', () => {
        it('should play a sfx', () => {
            audioBoard.playSfx('a', false, 0);
            expect(started).toBeTruthy();
            expect(chain).toEqual('G0SG1P');
        });
        it('should not play if blocked', () => {
            audioBoard['isBlocked'] = true;
            audioBoard.playSfx('a', false, 0);
            expect(started).toBeFalsy();
            expect(chain).toEqual('G0');
        });
        it('should not play if disabled', () => {
            audioBoard['enabled'] = false;
            audioBoard.playSfx('a', false, 0);
            expect(started).toBeFalsy();
            expect(chain).toEqual('G0');
        });
        it('should not play if position greater than 3', () => {
            audioBoard.playSfx('a', false, 4);
            expect(started).toBeFalsy();
            expect(chain).toEqual('G0');
            audioBoard.playSfx('a', false, -4);
            expect(started).toBeFalsy();
            expect(chain).toEqual('G0');
        });
        it('should play a sfx and block if requested', () => {
            audioBoard.playSfx('a', true, 0);
            expect(started).toBeTruthy();
            expect(audioBoard['isBlocked']).toBeTruthy();
            expect(chain).toEqual('G0SG1P');
        });
        it('should modify volume for positions greather than 1', () => {
            audioBoard.playSfx('a', false, 2);
            expect(started).toBeTruthy();
            expect(chain).toEqual('G0SG0.25P');
        });
    });

    describe('playBgm', () => {
        it('should play a bgm', () => {
            audioBoard.playBgm('a');
            expect(started).toBeTruthy();
            expect(chain).toEqual('G0SG0');
        });
        it('should not play if disabled', () => {
            audioBoard['enabled'] = false;
            audioBoard.playBgm('a');
            expect(started).toBeFalsy();
            expect(chain).toEqual('G0');
        });
    });
});
