import { log } from '@dialthetti/feather-engine-core';
import { AudioEventHandler } from './audio-event-handler';

declare const window: any; // eslint-disable-line

class AudioLayer {
    volume: number = 1;
    gainNode: GainNode;
    constructor(private audioContext: AudioContext, private layerName: string) {
        this.gainNode = this.audioContext.createGain();
    }
    setVolume(v: number | string): void {
        const newVol = determineNewVolume(v, this.volume);
        log(this, 'Set ' + this.layerName + ' Volume to ' + newVol);
        this.volume = newVol;
        this.gainNode.gain.value = this.volume;
    }
}

function determineNewVolume(v: number | string, oldVolume: number): number {
    let newVol: number;
    if (typeof v === 'string') {
        console.log(v, parseFloat(v));
        newVol = parseFloat(v) + oldVolume;
    } else {
        newVol = v;
    }
    return Math.max(0, Math.min(1, newVol));
}
export default class AudioBoard {
    private buffers: { [name: string]: AudioBuffer } = {};
    private lastSource: AudioScheduledSourceNode;
    private enabled = true;
    private isBlocked = false;
    private bgmChannel: AudioScheduledSourceNode;
    private onlyOneTrack = false;
    audioContext: AudioContext;

    private sfxVolume = 1;
    private masterAudioLayer: AudioLayer;
    private bgmLayer: AudioLayer;

    constructor() {
        this.audioContext = new AudioContext();
        new AudioEventHandler().connect(this);
        this.masterAudioLayer = new AudioLayer(this.audioContext, 'Master');
        this.masterAudioLayer.gainNode.connect(this.audioContext.destination);
        this.bgmLayer = new AudioLayer(this.audioContext, 'BGM');
        window.setAudio = (enabled): void => {
            this.enabled = enabled;
            if (!enabled) {
                if (this.lastSource) this.lastSource.stop();
                if (this.bgmChannel) this.bgmChannel.stop();
            }
        };
    }

    setSfxVolume(v: number | string): void {
        const newVol = determineNewVolume(v, this.sfxVolume);
        log(this, 'Set SFX Volume to ' + newVol);
        this.sfxVolume = newVol;
    }
    setBGMVolume(v: number | string): void {
        this.bgmLayer.setVolume(v);
    }
    setMasterVolume(v: number | string): void {
        this.masterAudioLayer.setVolume(v);
    }

    addAudio(name: string, buffer: AudioBuffer): void {
        this.buffers[name] = buffer;
    }

    playAudio(name: string, blocking: boolean, position: number): void {
        console.info(`Starting ${name} as Sfx`);
        if (!this.enabled) {
            return;
        }
        if (this.isBlocked) {
            return;
        }
        if (this.lastSource && this.onlyOneTrack) {
            this.lastSource.stop();
        }
        const source = this.audioContext.createBufferSource();
        const sfxGain = this.audioContext.createGain();

        if (Math.abs(position) > 3) {
            return;
        }
        if (Math.abs(position) > 1) {
            sfxGain.gain.value = this.sfxVolume / (position * position);
        } else {
            sfxGain.gain.value = this.sfxVolume;
        }
        const pannerOptions = { pan: position };
        const panner = new StereoPannerNode(this.audioContext, pannerOptions);

        source.connect(sfxGain).connect(panner).connect(this.masterAudioLayer.gainNode);

        source.buffer = this.buffers[name];
        source.start(0);
        if (blocking) {
            this.isBlocked = true;
            source.onended = (): boolean => (this.isBlocked = false);
        }
        this.lastSource = source;
    }

    playBGM(name: string): void {
        if (!this.enabled) {
            return;
        }
        console.info(`Starting ${name} as BGM`);
        if (this.bgmChannel) {
            this.bgmChannel.stop();
        }
        const source = this.audioContext.createBufferSource();

        source.connect(this.bgmLayer.gainNode).connect(this.masterAudioLayer.gainNode);
        source.buffer = this.buffers[name];
        source.loop = true;
        source.start(0);
        this.bgmChannel = source;
    }
}
