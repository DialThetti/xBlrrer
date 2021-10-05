import { FeatherEngine, KeyListener } from '@dialthetti/feather-engine-core';
import { PlaySfxEvent } from 'src/app/core/sfx';
import MenuSettingsScene from './menu-settings-scene';

export default class Input implements KeyListener {
    constructor(private menuSettings: MenuSettingsScene) {}
    keyDown(code: string): void {
        switch (code) {
            case 'Space':
                if (this.menuSettings.option === 3) this.menuSettings.submit();
                break;
            case 'KeyW':
                this.menuSettings.option--;
                FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
                break;
            case 'KeyS':
                this.menuSettings.option++;
                FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
                break;
            case 'KeyD':
                this.menuSettings.changeSettings('inc');
                break;
            case 'KeyA':
                this.menuSettings.changeSettings('dec');
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
