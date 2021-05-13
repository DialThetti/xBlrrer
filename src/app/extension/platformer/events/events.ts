import Event from '@engine/core/events/event';
export class PauseGameEvent implements Event<void> {
    name = 'PauseGame';
    payload: null;
}
export class ResumeGameEvent implements Event<void> {
    name = 'ResumeGame';
    payload: null;
}
