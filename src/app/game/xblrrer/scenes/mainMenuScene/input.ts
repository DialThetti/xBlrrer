import { KeyListener } from 'feather-engine-core';
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
                break;
            case 'KeyS':
                this.mainMenu.option++;
                break;
        }
    }

    keyUp(code: String): void {}

    keyPressed(code: String): void {}
}
