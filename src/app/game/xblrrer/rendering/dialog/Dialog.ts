import { FeatherEngine, KeyboardInput } from 'feather-engine-core';
import { Subject } from 'projects/feather-engine-events/dist';

export default class Dialog {
    static show(text: string[]) {
        FeatherEngine.eventBus.subscribe('dialog-next', {
            receive: (topic: string, subject: Subject) => {
                text.shift();
                console.log(text);
                if (text.length == 0) {
                    FeatherEngine.eventBus.publish('game-control', 'resume');
                    FeatherEngine.eventBus.publish('game-control-input', 'pop');
                    FeatherEngine.eventBus.unsubscribeAll('dialog-next');
                    FeatherEngine.eventBus.publish('dialog-clear', 'x');
                } else {
                    FeatherEngine.eventBus.publish('dialog-text', text[0]);
                }
            },
        });
        FeatherEngine.eventBus.publish('game-control-input', 'stash');
        FeatherEngine.eventBus.publish('game-control', 'pause');
        KeyboardInput.addKeyListener({
            keyDown: (e) => {
                if (e == 'Space') FeatherEngine.eventBus.publish('dialog-next', 'x');
            },
            keyUp: () => {},
            keyPressed: () => {},
        });
        FeatherEngine.eventBus.publish('dialog-text', text[0]);
    }
}
