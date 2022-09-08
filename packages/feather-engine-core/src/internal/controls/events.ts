import { Subject } from '@dialthetti/feather-engine-events';

export const INPUT_CONTROL_TOPIC = 'game-control-input';
export class PopControlInputEvent implements Subject<string> {
    topic = INPUT_CONTROL_TOPIC;
    payload = 'pop';
}
export class StashControlInputEvent implements Subject<string> {
    topic = INPUT_CONTROL_TOPIC;
    payload = 'stash';
}

export class ClearControlInputEvent implements Subject<string> {
    topic = INPUT_CONTROL_TOPIC;
    payload = 'clear';
}
