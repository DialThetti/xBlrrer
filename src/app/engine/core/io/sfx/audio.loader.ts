import Loader from '../loader';

export default class AudioLoader implements Loader<AudioBuffer> {
    constructor(private context: AudioContext, private audioURL: string) {}
    async load(): Promise<AudioBuffer> {
        const ogg = await fetch(this.audioURL);
        const buffer = await ogg.arrayBuffer();
        return this.context.decodeAudioData(buffer);
    }
}
