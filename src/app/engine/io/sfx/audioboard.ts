declare const window: any; // eslint-disable-line
export default class AudioBoard {
    buffers: { [name: string]: AudioBuffer } = {};
    lastSource: AudioScheduledSourceNode;
    enabled = true;
    isBlocked = false;

    bgmChannel: AudioScheduledSourceNode;
    constructor(private audioContext: AudioContext) {
        window.setAudio = (enabled): void => {
            this.enabled = enabled;
            if (!enabled) {
                if (this.lastSource) this.lastSource.stop();
                if (this.bgmChannel) this.bgmChannel.stop();
            }
        };
    }

    addAudio(name: string, buffer: AudioBuffer): void {
        this.buffers[name] = buffer;
    }
    playAudio(name: string, blocking: boolean): void {
        if (!this.enabled) {
            return;
        }
        if (this.isBlocked) {
            return;
        }
        if (this.lastSource) {
            this.lastSource.stop();
        }
        const source = this.audioContext.createBufferSource();
        source.connect(this.audioContext.destination);
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
