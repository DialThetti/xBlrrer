import { Canvas, FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect, Font, NineWaySpriteSheet } from '@dialthetti/feather-engine-graphics';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';
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
        this.drawSelectBox(context, (FeatherEngine.screenSize.width - 32 * 6) / 2, 340);
        // this.frame.draw(context, 32 * 2, 32 * 2, 384, 64 * 2);
        this.font.print(
            'by DialThetti',
            context,
            FeatherEngine.screenSize.width - 8 * 13 - 4,
            FeatherEngine.screenSize.height - 8 - 4,
        );
        this.font.print('v0.0.20211002-1', context, 4, FeatherEngine.screenSize.height - 8 - 4);
    }

    drawSelectBox(context: RenderContext, boxX: number, boxY: number): void {
        this.frame.draw(context, boxX, boxY, 32 * 6, 32 * 2);
        if (this.mainMenu.sav.hasData(0)) {
            this.font.print('Continue', context, boxX + 32, boxY + 16);
        }
        this.font.print('New Game', context, boxX + 32, boxY + 16 + 16 + 8);
        this.font.print('>', context, boxX + 16, boxY + 16 + 24 * this.mainMenu.option);
    }
    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
