import { KeyListener } from '@dialthetti/feather-engine-core';
import MainMenuScene from './mainMenu.scene';

export default class MenuKeyboard implements KeyListener {
    constructor(private mainMenu: MainMenuScene) {}
    keyDown(code: String): void {
        switch (code) {
            case 'Space':
                this.mainMenu.submit();
                break;
            case 'KeyW':
                this.mainMenu.option--;
                this.mainMenu.audioBoard.playAudio('pointer', false, 0);
                break;
            case 'KeyS':
                this.mainMenu.option++;
                this.mainMenu.audioBoard.playAudio('pointer', false, 0);
                break;
        }
    }

    keyUp(code: String): void {}

    keyPressed(code: String): void {}
}
