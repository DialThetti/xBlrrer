export default class Timer {
    lastTime = 0;
    accumulatedTime = 0;
    fps = 0;
    lastTimeFps = 0;
    constructor(private updateFunc: (deltaTime: number) => void, private deltaTime = 1 / 60) {}

    enqueue(): void {
        requestAnimationFrame((time) => this.update(time));
    }

    update(absoluteTime: number): void {
        this.accumulatedTime += (absoluteTime - this.lastTime) / 1000;
        if (this.accumulatedTime > 1) {
            this.accumulatedTime = 1;
            console.warn('resolve sleeping');
        }
        while (this.accumulatedTime > this.deltaTime) {
            this.fps++;
            this.updateFunc(this.deltaTime);
            this.accumulatedTime -= this.deltaTime;
        }
        if (absoluteTime - this.lastTimeFps > 1000) {
            console.log('FPS', this.fps);
            this.fps = 0;
            this.lastTimeFps = absoluteTime;
        }
        this.lastTime = absoluteTime;
        this.enqueue();
    }

    start(): void {
        this.enqueue();
    }
}
