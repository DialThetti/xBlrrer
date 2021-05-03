import AudioSpec from '../../../../model/AudioSpec';
import Loader from '../loader';
import { loadJson } from '../loaders';
import AudioLoader from './audio.loader';
import AudioBoard from './audioboard';

export default class AudioBoardLoader implements Loader<AudioBoard> {
    constructor(private context: AudioContext, private audioURL: string) {}

    async load(): Promise<AudioBoard> {
        const dcFile = await loadJson<AudioSpec>(this.audioURL);
        const audioBoard = new AudioBoard(this.context);
        const a = [...Object.keys(dcFile.fx)];
        for (const key in a) {
            if (Object.prototype.hasOwnProperty.call(a, key)) {
                const name = a[key];
                const url = dcFile.fx[name].url;
                const buffer = await new AudioLoader(this.context, url).load();
                audioBoard.addAudio(name, buffer);
            }
        }
        return audioBoard;
    }
}
