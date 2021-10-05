import { AudioLayer } from './audio-layer';
describe('AudioLayer', () => {
    let gainNode: GainNode;
    let audioContext: AudioContext;
    let audioLayer: AudioLayer;
    beforeEach(() => {
        gainNode = { gain: { value: 0 } } as GainNode;
        audioContext = {
            createGain: () => {
                return gainNode;
            },
        } as AudioContext;
        audioLayer = new AudioLayer(audioContext, 'foo');
    });
    it('should be created', () => {
        expect(audioLayer).toBeTruthy();
    });
    describe('setVolume', () => {
        describe('with number', () => {
            it('should modify gian nodes in interval 0-1', () => {
                audioLayer.setVolume(0);
                expect(gainNode.gain.value).toBe(0);
                expect(audioLayer.volume).toBe(0);
                audioLayer.setVolume(1);
                expect(gainNode.gain.value).toBe(1);
                expect(audioLayer.volume).toBe(1);
                audioLayer.setVolume(0.5);
                expect(gainNode.gain.value).toBe(0.5);
                expect(audioLayer.volume).toBe(0.5);
            });
            it('should not overflow', () => {
                audioLayer.setVolume(2);
                expect(gainNode.gain.value).toBe(1);
                expect(audioLayer.volume).toBe(1);
            });
            it('should not underflow', () => {
                audioLayer.setVolume(-1);
                expect(gainNode.gain.value).toBe(0);
                expect(audioLayer.volume).toBe(0);
            });
        });
        describe('with string', () => {
            it('should modify gian nodes in interval 0-1', () => {
                audioLayer.setVolume(0);
                expect(gainNode.gain.value).toBe(0);
                expect(audioLayer.volume).toBe(0);
                audioLayer.setVolume('+0.5');
                expect(gainNode.gain.value).toBe(0.5);
                expect(audioLayer.volume).toBe(0.5);
                audioLayer.setVolume('-0.3');
                expect(gainNode.gain.value).toBe(0.2);
                expect(audioLayer.volume).toBe(0.2);
            });
            it('should not overflow', () => {
                audioLayer.setVolume(0);
                audioLayer.setVolume('+2');
                expect(gainNode.gain.value).toBe(1);
                expect(audioLayer.volume).toBe(1);
            });
            it('should not underflow', () => {
                audioLayer.setVolume(0);
                audioLayer.setVolume('-1');
                expect(gainNode.gain.value).toBe(0);
                expect(audioLayer.volume).toBe(0);
            });
        });
    });
});
