import {
  FeatherEngine,
  KeyboardInput,
  PauseGameEvent,
  PopControlInputEvent,
  ResumeGameEvent,
  StashControlInputEvent,
} from '@dialthetti/feather-engine-core';
import { Keys } from 'src/app/scenes/keys';
export default class Dialog {
  static show(text: string[]): void {
    FeatherEngine.eventBus.subscribe('dialog-next', {
      receive: () => {
        text.shift();
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
      keyDown: e => {
        if (e == Keys.A) FeatherEngine.eventBus.publish({ topic: 'dialog-next', payload: 'x' });
      },
      keyUp: () => {
        //no keyup atm
      },
      keyPressed: () => {
        //no keyPressed atm
      },
    });
    FeatherEngine.eventBus.publish({ topic: 'dialog-text', payload: text[0] });
  }
}
