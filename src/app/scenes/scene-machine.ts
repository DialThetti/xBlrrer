import Timer from '../engine/timer';
import Scene from './scene';

export default class SceneMachine {
    private scenes: { [name: string]: { scene: Scene; loaded: boolean } } = {};
    private loadingScene: Scene;
    private currentSceneName = 'loadingScene';
    constructor(private context: CanvasRenderingContext2D) {}

    public async load(): Promise<void> {
        await this.loadingScene.load();
    }

    public start(): void {
        new Timer((deltaTime) => {
            this.currentScene.update(deltaTime);
            this.currentScene.draw(this.context, deltaTime);
        }).start();
    }

    public async setScene(name: string, withLoading = true): Promise<void> {
        if (withLoading) {
            console.info(`[Scene Machine] switch to Loadingscreen`);
            this.currentSceneName = 'loadingScene';
        }
        const sceneBlob = this.scenes[name];
        if (!sceneBlob.loaded) {
            console.info(`[Scene Machine] loading Scene ${name}`);
            await sceneBlob.scene.load();
            sceneBlob.loaded = true;
            console.info(`[Scene Machine] Scene ${name} loaded`);
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
        sceneProvider.forEach((s) => this.addScene(s));
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
