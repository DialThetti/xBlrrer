import SceneMachine from '../scenes/scene-machine';
import LoadingScene from './scenes/loadingScene/loading.scene';
import GameScene from './scenes/platformScene/game.scene';

declare const window: any; // eslint-disable-line

export default class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(private canvasId: string) {
        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
    }

    async start(): Promise<void> {
        const sceneMachine = new SceneMachine(this.context).addScenes([
            () => new LoadingScene(),
            () => new GameScene('transition'),
        ]);
        await sceneMachine.load();
        sceneMachine.start();
        sceneMachine.setScene('transition');
        console.log('scenes running');
    }
}
