import { FeatherEngine, info, log } from '@dialthetti/feather-engine-core';
import { AudioEventHandler } from './audio-event-handler';
import { AudioLayer } from './audio-layer';
import { determineNewVolume } from './audio-utils';

export default class AudioBoard {
  private buffers: { [name: string]: AudioBuffer } = {};

  private enabled = true;
  private isBlocked = false;
  private onlyOneTrack = false;

  private bgmChannel: AudioScheduledSourceNode;
  private lastSource: AudioScheduledSourceNode;

  private sfxVolume = 1;
  private masterAudioLayer: AudioLayer;
  private bgmLayer: AudioLayer;

  constructor(public readonly audioContext = new AudioContext()) {
    new AudioEventHandler(FeatherEngine.eventBus).connect(this);
    this.masterAudioLayer = new AudioLayer(this.audioContext, 'Master');
    this.masterAudioLayer.gainNode.connect(this.audioContext.destination);
    this.bgmLayer = new AudioLayer(this.audioContext, 'BGM');
  }

  public setSfxVolume(v: number | string): void {
    const newVol = determineNewVolume(v, this.sfxVolume);
    log(this, 'Set SFX Volume to ' + newVol);
    this.sfxVolume = newVol;
  }
  public setBgmVolume(v: number | string): void {
    this.bgmLayer.setVolume(v);
  }
  public setMasterVolume(v: number | string): void {
    this.masterAudioLayer.setVolume(v);
  }

  public addAudio(name: string, buffer: AudioBuffer): void {
    this.buffers[name] = buffer;
  }

  public playSfx(name: string, blocking: boolean, position = 0): void {
    if (!this.enabled || this.isBlocked) {
      return;
    }
    if (Math.abs(position) > 3) {
      return;
    }
    info(this, `Starting ${name} as Sfx`);

    if (this.lastSource && this.onlyOneTrack) {
      this.lastSource.stop();
    }
    const source = this.audioContext.createBufferSource();
    const sfxGain = this.audioContext.createGain();

    const panner = this.createPannerNode(position);
    if (Math.abs(position) <= 1) {
      position = 1;
    }
    sfxGain.gain.value = this.sfxVolume / (position * position);

    source.connect(sfxGain).connect(panner).connect(this.masterAudioLayer.gainNode);

    source.buffer = this.buffers[name];
    source.start(0);
    if (blocking) {
      this.isBlocked = true;
      source.onended = (): boolean => (this.isBlocked = false);
    }
    this.lastSource = source;
  }

  createPannerNode(position: number): StereoPannerNode {
    return new StereoPannerNode(this.audioContext, { pan: position });
  }

  public playBgm(name: string): void {
    if (!this.enabled) {
      return;
    }
    info(this, `Starting ${name} as BGM`);
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
