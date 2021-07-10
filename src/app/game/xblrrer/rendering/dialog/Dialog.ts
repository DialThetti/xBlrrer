import Level from '@engine/level/level';
import { PauseGameEvent, ResumeGameEvent } from '@extension/platformer/events/events';
import { KeyboardInput } from 'feather-engine-core';

export default class Dialog {
    static show(level: Level, text: string[]) {
        KeyboardInput.stashKeyListeners();
        level.eventBuffer.emit(new PauseGameEvent());
        text.forEach((e) => console.log(e));
        setTimeout(() => {
            level.eventBuffer.emit(new ResumeGameEvent());
            KeyboardInput.popKeyListeners();
        }, 1000);
    }
}
