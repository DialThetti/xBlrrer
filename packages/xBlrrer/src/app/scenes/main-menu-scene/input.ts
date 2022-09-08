import { FeatherEngine, KeyListener, log } from '@dialthetti/feather-engine-core';
import { PlaySfxEvent } from 'src/app/core/sfx';
import { Keys } from '../keys';
import MainMenuScene from './main-menu-scene';

export default class Input implements KeyListener {
  constructor(private mainMenu: MainMenuScene) {}
  keyDown(code: string): void {
    switch (code) {
      case Keys.A:
        this.mainMenu.submit();
        break;
      case Keys.UP:
        this.mainMenu.option--;
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
        break;
      case Keys.DOWN:
        this.mainMenu.option++;
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
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
