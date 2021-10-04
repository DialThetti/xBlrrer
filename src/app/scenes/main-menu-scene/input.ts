import { FeatherEngine, KeyListener } from '@dialthetti/feather-engine-core';
import { PlaySFXEvent, SetMasterVolumeEvent } from 'src/app/core/sfx';
import MainMenuScene from './main-menu-scene';

export default class MenuKeyboard implements KeyListener {
    constructor(private mainMenu: MainMenuScene) {}
    keyDown(code: string): void {
        switch (code) {
            case 'Space':
                this.mainMenu.submit();
                break;
            case 'KeyW':
                this.mainMenu.option--;
                FeatherEngine.eventBus.publish(new PlaySFXEvent({ name: 'pointer' }));
                break;
            case 'KeyS':
                this.mainMenu.option++;
                FeatherEngine.eventBus.publish(new PlaySFXEvent({ name: 'pointer' }));
                break;
            case 'Digit1':
                FeatherEngine.eventBus.publish(new SetMasterVolumeEvent({ value: '-0.1' }));

                break;
            case 'Digit2':
                FeatherEngine.eventBus.publish(new SetMasterVolumeEvent({ value: '+0.1' }));

                break;
            default:
                console.log(code);
        }
    }

    keyUp(): void {
        // no keyUp atm
    }

    keyPressed(): void {
        // no keyPressed atm
    }
}
