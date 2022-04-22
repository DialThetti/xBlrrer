import { FeatherEngine, intRange, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect, Font } from '@dialthetti/feather-engine-graphics';
import { RenderLayer } from 'src/app/core/rendering';

export class EngineLayer implements RenderLayer {
    readonly hex = [...intRange(0, 9), 'a', 'b', 'c', 'd', 'e', 'f'];

    readonly feather =
        '0000000000000100' +
        '0000000000001410' +
        '0000000100111410' +
        '0000001101334410' +
        '0000001213344410' +
        '0000012233334410' +
        '0000112232244100' +
        '0000122211344100' +
        '0010122113331000' +
        '0011221222210000' +
        '0001212211100000' +
        '0001111110000000' +
        '0011110011000000' +
        '0100011000000000';

    order: number[];
    constructor(
        private font: Font,
        private timer: () => number
    ) {
        this.order = this.shuffle(intRange(0, this.feather.length).filter(a => a !== 0));
    }


    public draw(context: RenderContext): void {


        if (this.timer() > 3) {
            this.font.print('Feather Engine ', context,
                FeatherEngine.screenSize.width / 2 - 8 * 8,
                FeatherEngine.screenSize.height / 2 - 8 * 8 + 8 * 16);
        }
        const x = (this.timer() > 3) ? 1 : this.timer() / 3;
        const set = new Set(this.order.slice(0, Math.floor(x * this.order.length)));
        for (let index = 0; index < this.feather.length; index++) {
            const n: number = parseInt(this.feather.charAt(index));
            if (!set.has(index))
                continue;
            if (n !== 0)
                drawRect(context,
                    FeatherEngine.screenSize.width / 2 - 8 * 8 + (index % 16) * 8,
                    FeatherEngine.screenSize.height / 2 - 8 * 8 + (Math.floor(index / 16) * 8),
                    8,
                    8,
                    ['#000000', '#878EA1', '#555B6D', '#333741'][n - 1],
                    { filled: true }
                );

        }
        if (this.timer() > 4) {
            //fading

            const id = Math.min(15, Math.floor(((this.timer() - 4) * 1.5) * 16));
            const a = this.hex[id] + '0';
            drawRect(context, 0, 0, FeatherEngine.screenSize.width, FeatherEngine.screenSize.height, '#000000' + a, {
                filled: true,
            });

        }
    }

    shuffle(a: number[]): number[] {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}
