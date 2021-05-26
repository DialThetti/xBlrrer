import Font from '@engine/core/rendering/font';
import { drawRect } from '@engine/core/rendering/helper';
import { SCREEN_SIZE } from '@engine/core/screen.settings';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { RenderContext } from 'feather-engine-core';
import MainMenuScene from '../mainMenu.scene';

export default class MainMenuLayer implements RenderLayer {
    constructor(private font: Font, private mainMenu: MainMenuScene) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, SCREEN_SIZE.width, SCREEN_SIZE.height, 'black', {
            filled: true,
        });
        this.font.print('Continue', context, SCREEN_SIZE.width / 2 - 4 * 8, 300);
        this.font.print('New Game', context, SCREEN_SIZE.width / 2 - 4 * 8, 300 + 16 + 8);

        this.font.print('>', context, SCREEN_SIZE.width / 2 - 4 * 8 - 16, 300 + 24 * this.mainMenu.option);
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
