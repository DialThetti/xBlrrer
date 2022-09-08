import { Subject } from '@dialthetti/feather-engine-events';

export const GAME_CONTROL_TOPIC = 'game-control';

export class ResumeGameEvent implements Subject<string> {
    topic = GAME_CONTROL_TOPIC;
    payload = 'resume';
}
export class PauseGameEvent implements Subject<string> {
    topic = GAME_CONTROL_TOPIC;
    payload = 'pause';
}
