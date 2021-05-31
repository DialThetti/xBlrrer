import FeatherEngine from '../feather-engine';
import { info, warn } from '../logger';
import { RenderContext } from '../renderer/canvas-renderer';
import { GameLoopListener, OnDraw, OnInput, OnUpdate } from './gameloop-listeners';
import Timer from './timer';

/**
 * This is the Main GameLoop.
 * For obvious reasons, it is a Singleton.
 */
export class GameLoop {
    private onInput: OnInput[] = [];
    private onUpdate: OnUpdate[] = [];
    private onDraw: OnDraw[] = [];

    private timer: Timer | null = null;
    private static instance = new GameLoop();

    private constructor() {
        // private constructor to implement Singleton Pattern
    }

    /**
     * Register a list of GameLoopListener, like OnInput, OnUpdate or OnDraw.
     * They will get notified whenever a new GameLoop Cycle happens
     * @param listeners
     */
    public static register(listeners: GameLoopListener[]): void {
        GameLoop.instance.register(listeners);
    }
    /**
     * Starts the main GameLoop.
     * It will use the `requestAnimationFrame` function and try to keep 60 FPS up
     * NOTE: do not call on your own, use FeatherEngine.start() instead
     */
    public static start(): void {
        GameLoop.instance.start();
    }

    /**
     * Cancels the main GameLoop.
     * NOTE: do not call on your own, FeatherEngine will handle this
     */
    public static cancel(): void {
        GameLoop.instance.cancel();
    }

    private register(listeners: GameLoopListener[]): void {
        listeners.forEach((l) => {
            let registered = false;
            if (typeof (l as OnInput).handleInput === 'function') {
                this.onInput.push(l as OnInput);
                registered = true;
            }
            if (typeof (l as OnUpdate).update === 'function') {
                this.onUpdate.push(l as OnUpdate);
                registered = true;
            }
            if (typeof (l as OnDraw).draw === 'function') {
                this.onDraw.push(l as OnDraw);
                registered = true;
            }
            if (!registered) {
                info(this, 'Registration of listener failed');
            }
        });
    }

    private start(): void {
        if (this.timer) {
            warn(this, 'There is already a timer, this one needs to be canceled');
            return;
        }
        info(this, 'Starting GameLoop');
        this.timer = new Timer((dT) => this.update(dT, FeatherEngine.Renderer.context));
        this.timer.start();
    }

    private update(dT: number, context: RenderContext): void {
        this.onInput.forEach((l) => l.handleInput());
        this.onUpdate.forEach((l) => l.update(dT));
        this.onDraw.forEach((l) => l.draw(context));
    }

    private cancel(): void {
        this.timer?.cancel();
        this.timer = null;
    }
}
