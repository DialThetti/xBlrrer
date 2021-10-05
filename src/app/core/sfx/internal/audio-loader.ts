import { Loader } from '@dialthetti/feather-engine-core';

export default class AudioLoader implements Loader<AudioBuffer> {
    constructor(private context: AudioContext, private audioURL: string) {}
    async load(): Promise<AudioBuffer> {
        const audioFile = await fetch(this.audioURL);
        const buffer = await audioFile.arrayBuffer();
        return this.context.decodeAudioData(buffer);
    }
}
