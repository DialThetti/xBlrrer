import { EventBus } from '@dialthetti/feather-engine-events';
import AudioBoard from './audioboard';
import * as Events from './events';

export class AudioEventHandler {
    constructor(private eventBus: EventBus) {}

    public connect(audioBoard: AudioBoard): void {
        this.eventBus.subscribe(Events.PLAY_SFX_TOPIC, {
            receive: (sfxEvent: Events.PlaySFXEvent): void => {
                const { name, blocking, position } = sfxEvent.payload;
                audioBoard.playAudio(name, blocking, position);
            },
        });
        this.eventBus.subscribe(Events.PLAY_BGM_TOPIC, {
            receive: (sfxEvent: Events.PlayBGMEvent): void => {
                const { name } = sfxEvent.payload;
                audioBoard.playBGM(name);
            },
        });
        this.eventBus.subscribe(Events.SET_VOLUME_BGM, {
            receive: (sfxEvent: Events.SetBGMVolumeEvent): void => {
                const { value } = sfxEvent.payload;
                audioBoard.setBGMVolume(value);
            },
        });
        this.eventBus.subscribe(Events.SET_VOLUME_SFX, {
            receive: (sfxEvent: Events.SetSFXVolumeEvent): void => {
                const { value } = sfxEvent.payload;
                audioBoard.setSfxVolume(value);
            },
        });
        this.eventBus.subscribe(Events.SET_VOLUME_MASTER, {
            receive: (sfxEvent: Events.SetMasterVolumeEvent): void => {
                const { value } = sfxEvent.payload;
                audioBoard.setMasterVolume(value);
            },
        });
    }
}
