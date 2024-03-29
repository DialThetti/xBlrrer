import { FeatherEngine, GameLoop, info, OnDraw, OnUpdate } from '@dialthetti/feather-engine-core';
import { ShowSceneEvent, SHOW_SCENE_EVENT } from './events';
import { Scene } from './scene';

export class SceneMachine {
  public static instance: SceneMachine;
  private scenes: { [name: string]: { scene: Scene; loaded: boolean } } = {};
  private loadingScene: Scene;
  private currentSceneName = 'loadingScene';
  constructor() {
    SceneMachine.instance = this;
  }

  public async load(): Promise<void> {
    await this.loadingScene.load();
  }

  public start(): void {
    GameLoop.register(
      {
        update: deltaTime => {
          this.currentScene.update(deltaTime);
        },
      } as OnUpdate,
      {
        draw: renderingContext => {
          this.currentScene.draw(renderingContext);
        },
      } as OnDraw
    );
    FeatherEngine.eventBus.subscribe(SHOW_SCENE_EVENT, {
      receive: (event: ShowSceneEvent) =>
        this.setScene(event.payload.name, event.payload.withLoading, event.payload.forceLoading),
    });
  }

  private async setScene(name: string, withLoading = true, forceLoading = false): Promise<void> {
    if (withLoading) {
      info(this, 'Switch to Loadingscreen');
      this.currentSceneName = 'loadingScene';
    }
    const sceneBlob = this.scenes[name];
    if (forceLoading || !sceneBlob.loaded) {
      info(this, `Loading Scene ${name}`);
      await sceneBlob.scene.load();
      sceneBlob.loaded = true;
      info(this, `Scene ${name} loaded`);
    }
    await sceneBlob.scene.start();
    this.currentSceneName = name;
  }

  private get currentScene(): Scene {
    if (this.currentSceneName === 'loadingScene') {
      return this.loadingScene;
    }
    return this.scenes[this.currentSceneName].scene;
  }

  public addScenes(sceneProvider: (() => Scene)[]): SceneMachine {
    sceneProvider.forEach(s => this.addScene(s));
    return this;
  }

  private addScene(sceneProvider: () => Scene): SceneMachine {
    const scene = sceneProvider();
    if (scene.isLoadingScene) {
      this.loadingScene = scene;
    } else {
      this.scenes[scene.name] = { scene, loaded: false };
    }
    return this;
  }

  get size(): number {
    return Object.keys(this.scenes).length + (this.loadingScene ? 1 : 0);
  }
}
