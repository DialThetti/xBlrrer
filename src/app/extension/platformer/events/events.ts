import { Subject } from 'feather-engine-events';

export class PauseGameEvent implements Subject<void> {
    topic = 'PauseGame';
    payload: null;
}
export class ResumeGameEvent implements Subject<void> {
    topic = 'ResumeGame';
    payload: null;
}
