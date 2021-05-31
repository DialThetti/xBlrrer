import RenderLayer from '@engine/level/rendering/renderLayer';
import { FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect, Font } from 'feather-engine-graphics';
import MainMenuScene from '../mainMenu.scene';

export default class MainMenuLayer implements RenderLayer {
    constructor(private font: Font, private mainMenu: MainMenuScene) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, 'black', {
            filled: true,
        });
        this.font.print('Continue', context, FeatherEngine.screenSize.width / 2 - 4 * 8, 300);
        this.font.print('New Game', context, FeatherEngine.screenSize.width / 2 - 4 * 8, 300 + 16 + 8);

        this.font.print('>', context, FeatherEngine.screenSize.width / 2 - 4 * 8 - 16, 300 + 24 * this.mainMenu.option);
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
