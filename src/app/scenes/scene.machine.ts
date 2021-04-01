import Timer from '../engine/timer';
import Scene from './scene';

export default class SceneMachine {
    scenes: { [name: string]: { scene: Scene; loaded: boolean } } = {};
    loadingScene: Scene;
    currentSceneName: string = 'loadingScene';
    constructor(private context: CanvasRenderingContext2D) {}
    public addScene(sceneProvider: () => Scene): SceneMachine {
        const scene = sceneProvider();
        if (scene.isLoadingScene) {
            this.loadingScene = scene;
        } else {
            this.scenes[scene.name] = { scene, loaded: false };
        }
        return this;
    }
    public async load(): Promise<void> {
        await this.loadingScene.load();
    }
    public start(): void {
        new Timer(deltaTime => {
            this.currentScene.update(deltaTime);
            this.currentScene.draw(this.context, deltaTime);
        }).start();
    }

    public async setScene(name: string, withLoading: boolean = true): Promise<void> {
        if (withLoading) {
            this.currentSceneName = 'loadingScene';
        }
        const sceneBlob = this.scenes[name];
        if (!sceneBlob.loaded) {
            console.info(`loading Scene ${name}`);
            await sceneBlob.scene.load();
            sceneBlob.loaded = true;
            console.info(`Scene ${name} loaded`);
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
}
