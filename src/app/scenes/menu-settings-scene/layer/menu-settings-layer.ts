import { Canvas, FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect, Font, NineWaySpriteSheet } from '@dialthetti/feather-engine-graphics';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';
import MenuSettingsScene from '../menu-settings-scene';

export default class MenuSettingsLayer implements RenderLayer {
    constructor(
        private font: Font,
        private img: Canvas,
        private frame: NineWaySpriteSheet,
        private menuSettings: MenuSettingsScene,
    ) {}

    public draw(context: RenderContext): void {
        drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, 'black', {
            filled: true,
        });
        context.drawImage(this.img, 0, 0);
        this.drawSelectBox(context, 16 * 4, 16 * 4);
    }

    private drawSelectBox(context: RenderContext, boxX: number, boxY: number): void {
        this.frame.draw(
            context,
            boxX,
            boxY,
            FeatherEngine.screenSize.width - 16 * 8,
            FeatherEngine.screenSize.height - 16 * 8,
        );
        const textY = boxY + 16 + 4;
        const textX = boxX + 32 + 4;
        this.font.print('Master Volume', context, textX, textY);
        this.font.print(this.getVolBar(this.menuSettings.currentData.masterVolume), context, textX + 16 * 10, textY);

        this.font.print('BGM Volume', context, textX, textY + 24);
        this.font.print(this.getVolBar(this.menuSettings.currentData.bgmVolume), context, textX + 16 * 10, textY + 24);

        this.font.print('SFX Volume', context, textX, textY + 24 * 2);
        this.font.print(
            this.getVolBar(this.menuSettings.currentData.sfxVolume),
            context,
            textX + 16 * 10,
            textY + 24 * 2,
        );
        this.font.print('Back', context, textX, textY + 24 * 3);
        this.font.print('>', context, boxX + 16 + 4, textY + 24 * this.menuSettings.option);
    }

    private getVolBar(v: number): string {
        return '|'.repeat(v) + '.'.repeat(10 - v);
    }
}
