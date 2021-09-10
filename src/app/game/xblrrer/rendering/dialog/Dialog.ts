import { FeatherEngine, KeyboardInput } from 'feather-engine-core';
import { Subject } from 'feather-engine-events';

export default class Dialog {
    static show(text: string[]) {
        FeatherEngine.eventBus.subscribe('dialog-next', {
            receive: (subject: Subject<any>) => {
                text.shift();
                console.log(text);
                if (text.length == 0) {
                    FeatherEngine.eventBus.publish({ topic: 'game-control', payload: 'resume' });
                    FeatherEngine.eventBus.publish({ topic: 'game-control-input', payload: 'pop' });
                    FeatherEngine.eventBus.unsubscribeAll('dialog-next');
                    FeatherEngine.eventBus.publish({ topic: 'dialog-clear', payload: 'x' });
                } else {
                    FeatherEngine.eventBus.publish({ topic: 'dialog-text', payload: text[0] });
                }
            },
        });
        FeatherEngine.eventBus.publish({ topic: 'game-control-input', payload: 'stash' });
        FeatherEngine.eventBus.publish({ topic: 'game-control', payload: 'pause' });
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
