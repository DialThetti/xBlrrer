import { Vector } from '@dialthetti/feather-engine-core';
import { Subject } from '@dialthetti/feather-engine-events';

export const SHOW_SCENE_EVENT = 'show_scene_event';
export const TRANSITION_EVENT = 'transition_event';
export class ShowSceneEvent implements Subject<{ name: string; withLoading?: boolean; forceLoading?: boolean }> {
  topic = SHOW_SCENE_EVENT;
  constructor(public payload: { name: string; withLoading?: boolean; forceLoading?: boolean }) {}
}

export class TransitionEvent implements Subject<{ levelName: string; position: Vector }> {
  topic = TRANSITION_EVENT;
  constructor(public payload: { levelName: string; position: Vector }) {}
}
