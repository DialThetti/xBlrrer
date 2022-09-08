import { warn } from '../logger';

export default class Timer {
    public fps = 0;

    private lastTime = 0;
    private accumulatedTime = 0;
    private _fps = 0;
    private canceled = false;

    constructor(private updateFunc: (deltaTime: number) => void, private deltaTime = 1 / 60) {}

    private update(absoluteTime: number): void {
        const currentDt = (absoluteTime - this.lastTime) / 1000;
        this.accumulatedTime += currentDt;
        if (this.accumulatedTime > 1) {
            this.accumulatedTime = 1;
            warn(this, 'resolve sleeping');
        }
        while (this.accumulatedTime > this.deltaTime) {
            this.updateFunc(this.deltaTime);
            this.accumulatedTime -= this.deltaTime;
        }

        this.lastTime = absoluteTime;
        if (!this.canceled) this.enqueue();
    }

    public start(): void {
        this.enqueue();
        this.updateFps();
    }

    public cancel(): void {
        this.canceled = true;
    }
    private enqueue(): void {
        this._fps++;
        requestAnimationFrame((time) => this.update(time));
    }

    private updateFps(): void {
        setTimeout(() => {
            this.fps = this._fps;
            this._fps = 0;
            this.updateFps();
        }, 1000);
    }
}
