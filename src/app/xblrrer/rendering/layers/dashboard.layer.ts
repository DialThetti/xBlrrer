import Font from '../../../engine/rendering/font';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';

export default class DashboardLayer implements RenderLayer {
    constructor(
        private font: Font,
        private stats: () => { time: number; level: string; score: number; coins: number },
    ) {}

    draw(context: CanvasRenderingContext2D): void {
        const statsNow = this.stats();
        // Points
        this.font.print('SANCHEZ', context, 8, 4);
        this.font.print(this.withZero(statsNow.score, 6), context, 8, 8 + 4);
        // Coins
        this.font.print(`@x${this.withZero(statsNow.coins, 2)}`, context, 75, 8 + 4);
        // World
        this.font.print('WORLD', context, 150, 4);
        this.font.print(statsNow.level, context, 150 + 8, 8 + 4);
        // Time
        this.font.print('TIME', context, 208, 4);
        this.font.print(this.withZero(statsNow.time, 3), context, 208 + 8, 8 + 4);
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
