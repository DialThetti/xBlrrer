import RenderLayer from '@engine/level/rendering/renderLayer';
import { Canvas, FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect, Font, NineWaySpriteSheet } from 'feather-engine-graphics';
import MainMenuScene from '../mainMenu.scene';

export default class MainMenuLayer implements RenderLayer {
    constructor(
        private font: Font,
        private img: Canvas,
        private frame: NineWaySpriteSheet,
        private mainMenu: MainMenuScene,
    ) {}

    draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, 'black', {
            filled: true,
        });
        context.drawImage(this.img, 0, 0);
        const boxX = (FeatherEngine.screenSize.width - 32 * 6) / 2;
        const boxY = 340;
        this.frame.draw(context, boxX, boxY, 32 * 6, 32 * 2);
        this.font.print('Continue', context, boxX + 32, boxY + 16);
        this.font.print('New Game', context, boxX + 32, boxY + 16 + 16 + 8);
        this.font.print('>', context, boxX + 16, boxY + 16 + 24 * this.mainMenu.option);
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
