import AudioLoader from './audio-loader';

describe('AudioLoader', () => {
  const audioLoader = new AudioLoader({} as AudioContext, '');
  it('should be created', () => {
    expect(audioLoader).toBeTruthy();
  });
});
