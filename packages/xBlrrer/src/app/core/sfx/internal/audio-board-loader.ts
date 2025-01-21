import { Loader, loadJson } from '@dialthetti/feather-engine-core';
import AudioBoard from './audio-board';
import AudioLoader from './audio-loader';
import { AudioSpec } from './model/audio-model';

export default class AudioBoardLoader implements Loader<AudioBoard> {
  constructor(private audioURL: string) {}

  async load(): Promise<AudioBoard> {
    const dcFile = await loadJson<AudioSpec>(this.audioURL);
    const audioBoard = new AudioBoard();
    console.log(this.audioURL);
    Promise.all(
      Object.entries(dcFile.fx).map(async ([name, value]) => {
        const url = value.url;
        const buffer = await new AudioLoader(audioBoard.audioContext, url).load();
        audioBoard.addAudio(name, buffer);
      })
    );

    return audioBoard;
  }
}
