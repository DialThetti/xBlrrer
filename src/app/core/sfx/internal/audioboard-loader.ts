import { Loader, loadJson } from '@dialthetti/feather-engine-core';
import AudioLoader from './audio-loader';
import AudioBoard from './audioboard';
import AudioSpec from './model/audio-model';

export default class AudioBoardLoader implements Loader<AudioBoard> {
    constructor(private audioURL: string) {}

    async load(): Promise<AudioBoard> {
        const dcFile = await loadJson<AudioSpec>(this.audioURL);
        const audioBoard = new AudioBoard();

        const a = [...Object.keys(dcFile.fx)];
        for (const key in a) {
            if (Object.prototype.hasOwnProperty.call(a, key)) {
                const name = a[key];
                const url = dcFile.fx[name].url;
                const buffer = await new AudioLoader(audioBoard.audioContext, url).load();
                audioBoard.addAudio(name, buffer);
            }
        }
        return audioBoard;
    }
}
