declare const window: any; // eslint-disable-line
export default class AudioBoard {
    buffers: { [name: string]: AudioBuffer } = {};
    lastSource: AudioScheduledSourceNode;
    enabled = true;
    isBlocked = false;
    bgmChannel: AudioScheduledSourceNode;

    volume = 1;
    constructor(private audioContext: AudioContext) {
        window.setAudio = (enabled): void => {
            this.enabled = enabled;
            if (!enabled) {
                if (this.lastSource) this.lastSource.stop();
                if (this.bgmChannel) this.bgmChannel.stop();
            }
        };
    }

    setVolume(v: number): void {
        this.volume = v > 1 ? 1 : v < 0 ? 0 : v;
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
        if (this.lastSource) {
            //     this.lastSource.stop();
        }
        const source = this.audioContext.createBufferSource();

        const gain = this.audioContext.createGain();
        if (Math.abs(position) > 3) {
            return;
        }
        if (Math.abs(position) > 1) {
            gain.gain.value = this.volume / (position * position);
        } else {
            gain.gain.value = this.volume;
        }
        console.log(position);
        const pannerOptions = { pan: position };
        const panner = new StereoPannerNode(this.audioContext, pannerOptions);

        source.connect(gain).connect(panner).connect(this.audioContext.destination);

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
        source.connect(this.audioContext.destination);
        source.buffer = this.buffers[name];
        source.loop = true;
        source.start(0);
        this.bgmChannel = source;
    }
}
