import { GameLoop } from './gameloop/gameloop';
import { error, warn } from './logger';
import { CanvasRenderer } from './renderer/canvas-renderer';

export interface EngineConfig {
    canvasId: string;
}
export default class FeatherEngine {
    private initialized = false;
    private config: EngineConfig | null = null;

    private renderer: CanvasRenderer | null = null;
    private static instance = new FeatherEngine();

    public static init(engineConfig: EngineConfig): void {
        FeatherEngine.instance.init(engineConfig);
    }
    public static start(): void {
        FeatherEngine.instance.start();
    }
    public static get Renderer(): CanvasRenderer {
        return FeatherEngine.instance.renderer as CanvasRenderer;
    }

    private init(engineConfig: EngineConfig): void {
        if (this.initialized) {
            warn(this, 'Engine was initialized already, new config will be ignored.');
            return;
        }
        if (!engineConfig) {
            warn(this, 'config is empty and will be ignored.');
            return;
        }
        this.config = engineConfig;
        this.renderer = new CanvasRenderer(engineConfig);
        this.initialized = true;
    }

    private start(): void {
        if (!this.initialized) {
            error(this, 'Engine was not initialized, but tried to start. call `FeatherEngine.init(<config>)` first.');
            return;
        }
        GameLoop.start();
    }
}
