import { Subject } from '@dialthetti/feather-engine-events';

export const PLAY_SFX_TOPIC = 'playSFX';
export const PLAY_BGM_TOPIC = 'playBGM';
export const SET_VOLUME_MASTER = 'setVolumeMASTER';
export const SET_VOLUME_BGM = 'setVolumeBGM';
export const SET_VOLUME_SFX = 'setVolumeSFX';
export class PlaySFXEvent implements Subject<{ name: string; blocking?: boolean; position?: number }> {
    topic = PLAY_SFX_TOPIC;
    constructor(public payload: { name: string; blocking?: boolean; position?: number }) {}
}

export class PlayBGMEvent implements Subject<{ name: string }> {
    topic = PLAY_BGM_TOPIC;
    constructor(public payload: { name: string }) {}
}
export class SetMasterVolumeEvent implements Subject<{ value: number | string }> {
    topic = SET_VOLUME_MASTER;
    constructor(public payload: { value: number | string }) {}
}
export class SetBGMVolumeEvent implements Subject<{ value: number | string }> {
    topic = SET_VOLUME_BGM;
    constructor(public payload: { value: number | string }) {}
}

export class SetSFXVolumeEvent implements Subject<{ value: number | string }> {
    topic = SET_VOLUME_SFX;
    constructor(public payload: { value: number | string }) {}
}
