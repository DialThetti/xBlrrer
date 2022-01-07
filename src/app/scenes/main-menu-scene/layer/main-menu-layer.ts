import { Canvas, FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect, Font, NineWaySpriteSheet } from '@dialthetti/feather-engine-graphics';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';
import MainMenuScene from '../main-menu-scene';

export default class MainMenuLayer implements RenderLayer {
    constructor(
        private font: Font,
        private img: Canvas,
        private frame: NineWaySpriteSheet,
        private mainMenu: MainMenuScene,
    ) { }

    public draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, 'black', {
            filled: true,
        });
        context.drawImage(this.img, 0, 0);
        this.drawSelectBox(context, (FeatherEngine.screenSize.width - 32 * 6) / 2, 16 * 21);
        const lastRow = FeatherEngine.screenSize.height - 8 - 4;
        this.font.print('by DialThetti', context, FeatherEngine.screenSize.width - 8 * 14 + 4, lastRow);
        this.font.print('v0.0.20211018-1', context, 4, lastRow);
    }

    private drawSelectBox(context: RenderContext, boxX: number, boxY: number): void {
        this.frame.draw(context, boxX, boxY, 32 * 6, 32 * 3);
        const textY = boxY + 16 + 4;
        const textX = boxX + 32 + 4;
        if (this.mainMenu.sav.hasData(0)) {
            this.font.print('Continue', context, textX, textY);
        }
        this.font.print('New Game', context, textX, textY + 24);
        this.font.print('Settings', context, boxX + 32 + 4, textY + 2 * 24);
        this.font.print('>', context, boxX + 16 + 4, textY + 24 * this.mainMenu.option);
    }
}
