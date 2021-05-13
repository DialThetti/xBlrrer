import KeyboardState, { KeyState } from '@engine/core/io/keyboardState';
import MainMenuScene from './mainMenu.scene';

export default class MenuKeyboard extends KeyboardState {
    constructor(private mainMenu: MainMenuScene) {
        super();

        const isPressed = (keyState): boolean => keyState === KeyState.PRESSED;

        this.addMapping('Space', (keyState) => mainMenu.submit())
            .addMapping('KeyW', (keyState) => (isPressed(keyState) ? mainMenu.option-- : null))
            .addMapping('KeyS', (keyState) => (isPressed(keyState) ? mainMenu.option++ : null));
    }
}
