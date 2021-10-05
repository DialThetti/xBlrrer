import { EventBus, Receiver } from '@dialthetti/feather-engine-events';
import AudioBoard from './audio-board';
import * as Events from './events';

export const playSfxOn: (AudioBoard) => Receiver = (audioBoard) => ({
    receive: (sfxEvent: Events.PlaySfxEvent): void => {
        const { name, blocking, position } = sfxEvent.payload;
        audioBoard.playSfx(name, blocking, position);
    },
});

export const playBgmOn: (AudioBoard) => Receiver = (audioBoard) => ({
    receive: (sfxEvent: Events.PlayBgmEvent): void => {
        const { name } = sfxEvent.payload;
        audioBoard.playBgm(name);
    },
});
export const setBgmVolumeOn: (AudioBoard) => Receiver = (audioBoard) => ({
    receive: (sfxEvent: Events.SetBgmVolumeEvent): void => {
        const { value } = sfxEvent.payload;
        audioBoard.setBgmVolume(value);
    },
});
export const setSfxVolumeOn: (AudioBoard) => Receiver = (audioBoard) => ({
    receive: (sfxEvent: Events.SetSfxVolumeEvent): void => {
        const { value } = sfxEvent.payload;
        audioBoard.setSfxVolume(value);
    },
});
export const setMasterVolumeOn: (AudioBoard) => Receiver = (audioBoard) => ({
    receive: (sfxEvent: Events.SetMasterVolumeEvent): void => {
        const { value } = sfxEvent.payload;
        audioBoard.setMasterVolume(value);
    },
});
export class AudioEventHandler {
    constructor(private eventBus: EventBus) {}

    public connect(audioBoard: AudioBoard): void {
        this.eventBus.subscribe(Events.PLAY_SFX_TOPIC, playSfxOn(audioBoard));
        this.eventBus.subscribe(Events.PLAY_BGM_TOPIC, playBgmOn(audioBoard));
        this.eventBus.subscribe(Events.SET_VOLUME_BGM, setBgmVolumeOn(audioBoard));
        this.eventBus.subscribe(Events.SET_VOLUME_SFX, setSfxVolumeOn(audioBoard));
        this.eventBus.subscribe(Events.SET_VOLUME_MASTER, setMasterVolumeOn(audioBoard));
    }
}
