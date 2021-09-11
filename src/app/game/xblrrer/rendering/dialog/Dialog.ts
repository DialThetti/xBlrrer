import {
    FeatherEngine,
    KeyboardInput,
    PauseGameEvent,
    PopControlInputEvent,
    ResumeGameEvent,
    StashControlInputEvent,
} from 'feather-engine-core';
export default class Dialog {
    static show(text: string[]) {
        FeatherEngine.eventBus.subscribe('dialog-next', {
            receive: () => {
                text.shift();
                console.log(text);
                if (text.length == 0) {
                    FeatherEngine.eventBus.publish(new ResumeGameEvent());
                    FeatherEngine.eventBus.publish(new PopControlInputEvent());
                    FeatherEngine.eventBus.unsubscribeAll('dialog-next');
                    FeatherEngine.eventBus.publish({ topic: 'dialog-clear', payload: 'x' });
                } else {
                    FeatherEngine.eventBus.publish({ topic: 'dialog-text', payload: text[0] });
                }
            },
        });
        FeatherEngine.eventBus.publish(new StashControlInputEvent());
        FeatherEngine.eventBus.publish(new PauseGameEvent());
        KeyboardInput.addKeyListener({
            keyDown: (e) => {
                if (e == 'Space') FeatherEngine.eventBus.publish({ topic: 'dialog-next', payload: 'x' });
            },
            keyUp: () => {},
            keyPressed: () => {},
        });
        FeatherEngine.eventBus.publish({ topic: 'dialog-text', payload: text[0] });
    }
}
