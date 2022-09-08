import { EventBus } from '@dialthetti/feather-engine-events';
import { GameLoop } from './gameloop/gameloop';
import { error, warn } from './logger';
import { CanvasRenderer } from './renderer/canvas-renderer';
import { LocalStorageSaveDataSystem, SaveDataSystem } from './save-system/save-data-manager';
import { JSONSaveDataMarshaller } from './save-system/save-data-marshaller';
export interface EngineConfig {
  canvasId: string;
  width: number;
  height: number;
}

export interface DebugSettings {
  enabled: boolean;
  hitboxesOnly: boolean;
  showFps: boolean;
}

export default class FeatherEngine {
  private initialized = false;

  private config: EngineConfig | null = null;

  private renderer: CanvasRenderer | null = null;
  private static instance = new FeatherEngine();
  private static saveDataSystem: SaveDataSystem<any>;
  private debugSettings: DebugSettings = {
    enabled: false,
    hitboxesOnly: false,
    showFps: false,
  };

  public static readonly eventBus = new EventBus();

  public static init(engineConfig: EngineConfig): void {
    FeatherEngine.instance.init(engineConfig);
  }
  public static start(): void {
    FeatherEngine.instance.start();
  }
  public static get Renderer(): CanvasRenderer {
    return FeatherEngine.instance.renderer as CanvasRenderer;
  }

  public static getSaveDataSystem<T>(): SaveDataSystem<T> {
    if (this.saveDataSystem === undefined) {
      this.saveDataSystem = new LocalStorageSaveDataSystem(new JSONSaveDataMarshaller());
    }
    return this.saveDataSystem;
  }

  public static setSaveDataSystem<T>(system: SaveDataSystem<T>): void {
    this.saveDataSystem = system;
  }

  public static get screenSize(): { width: number; height: number } {
    const width = FeatherEngine.instance.config?.width;
    const height = FeatherEngine.instance.config?.height;

    return { width: width ?? 0, height: height ?? 0 };
  }

  public static get debugSettings(): DebugSettings {
    return FeatherEngine.instance.debugSettings;
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
