import { FeatherEngine, KeyListener, log } from '@dialthetti/feather-engine-core';
import { PlaySfxEvent } from 'src/app/core/sfx';
import { Keys } from '../keys';
import MenuSettingsScene from './menu-settings-scene';

export default class Input implements KeyListener {
  constructor(private menuSettings: MenuSettingsScene) {}
  keyDown(code: string): void {
    switch (code) {
      case Keys.A:
        if (this.menuSettings.option === 3) this.menuSettings.submit();
        break;
      case Keys.UP:
        this.menuSettings.option--;
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
        break;
      case Keys.DOWN:
        this.menuSettings.option++;
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
        break;
      case Keys.RIGHT:
        this.menuSettings.changeSettings('inc');
        break;
      case Keys.LEFT:
        this.menuSettings.changeSettings('dec');
        break;

      default:
        log(this, code);
    }
  }

  keyUp(): void {
    // no keyUp atm
  }

  keyPressed(): void {
    // no keyPressed atm
  }
}
