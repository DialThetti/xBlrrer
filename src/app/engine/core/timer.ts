import { debugSettings } from './debug';

export default class Timer {
    lastTime = 0;
    accumulatedTime = 0;
    fps = 0;
    constructor(private updateFunc: (deltaTime: number) => void, private deltaTime = 1 / 60) {}

    enqueue(): void {
        this.fps++;
        requestAnimationFrame((time) => this.update(time));
    }

    update(absoluteTime: number): void {
        const currentDt = (absoluteTime - this.lastTime) / 1000;
        this.accumulatedTime += currentDt;
        if (this.accumulatedTime > 1) {
            this.accumulatedTime = 1;
            console.warn('resolve sleeping');
        }
        while (this.accumulatedTime > this.deltaTime) {
            this.updateFunc(this.deltaTime);
            this.accumulatedTime -= this.deltaTime;
        }

        this.lastTime = absoluteTime;
        this.enqueue();
    }

    start(): void {
        this.enqueue();
        this.showFps();
    }

    showFps() {
        setTimeout(() => {
            if (debugSettings.showFPS) {
                console.log('FPS', this.fps);
            }
            this.fps = 0;
            this.showFps();
        }, 1000);
    }
}
