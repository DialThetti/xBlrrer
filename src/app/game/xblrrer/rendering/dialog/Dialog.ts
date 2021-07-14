import { FeatherEngine } from 'feather-engine-core';

export default class Dialog {
    static show(text: string[]) {
        FeatherEngine.eventBus.publish('game-control-input', 'stash');
        FeatherEngine.eventBus.publish('game-control', 'pause');
        text.forEach((e) => console.log(e));
        setTimeout(() => {
            FeatherEngine.eventBus.publish('game-control', 'resume');
            FeatherEngine.eventBus.publish('game-control-input', 'pop');
        }, 1000);
    }
}
