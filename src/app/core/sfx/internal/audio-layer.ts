import { log } from '@dialthetti/feather-engine-core';
import { determineNewVolume } from './audio-utils';
export class AudioLayer {
    volume = 1;

    public readonly gainNode: GainNode;
    constructor(private audioContext: AudioContext, private layerName: string) {
        this.gainNode = this.audioContext.createGain();
    }

    public setVolume(v: number | string): void {
        const newVol = determineNewVolume(v, this.volume);
        log(this, 'Set ' + this.layerName + ' Volume to ' + newVol);
        this.volume = newVol;
        this.gainNode.gain.value = this.volume;
    }
}
