import { Subject } from "@dialthetti/feather-engine-events";

export const SHOW_SCENE_EVENT = 'setVolumeSFX';
export class ShowSceneEvent implements Subject<{ name: string; withLoading?: boolean; forceLoading?: boolean }> {
    topic = SHOW_SCENE_EVENT;
    constructor(public payload: { name: string; withLoading?: boolean; forceLoading?: boolean }) { }
}
