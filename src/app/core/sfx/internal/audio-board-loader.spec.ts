import AudioLoader from './audio-loader';

describe('AudioLoader', () => {
    let audioLoader = new AudioLoader({} as AudioContext, '');
    it('should be created', () => {
        expect(audioLoader).toBeTruthy();
    });
});
