import { Subject } from '@dialthetti/feather-engine-events';

export const PLAY_SFX_TOPIC = 'playSFX';
export const PLAY_BGM_TOPIC = 'playBGM';
export const SET_VOLUME_MASTER = 'setVolumeMASTER';
export const SET_VOLUME_BGM = 'setVolumeBGM';
export const SET_VOLUME_SFX = 'setVolumeSFX';
export class PlaySfxEvent implements Subject<{ name: string; blocking?: boolean; position?: number }> {
    topic = PLAY_SFX_TOPIC;
    constructor(public payload: { name: string; blocking?: boolean; position?: number }) {}
}

export class PlayBgmEvent implements Subject<{ name: string }> {
    topic = PLAY_BGM_TOPIC;
    constructor(public payload: { name: string }) {}
}
export class SetMasterVolumeEvent implements Subject<{ value: number | string }> {
    topic = SET_VOLUME_MASTER;
    constructor(public payload: { value: number | string }) {}
}
export class SetBgmVolumeEvent implements Subject<{ value: number | string }> {
    topic = SET_VOLUME_BGM;
    constructor(public payload: { value: number | string }) {}
}

export class SetSfxVolumeEvent implements Subject<{ value: number | string }> {
    topic = SET_VOLUME_SFX;
    constructor(public payload: { value: number | string }) {}
}
