import FontLoader from '@engine/core/io/font.loader';
import RenderLayer from '@engine/core/rendering/layers/renderLayer';
import Camera from '@engine/core/world/camera';
import Scene from '@engine/scenes/scene';
import SceneMachine from '@engine/scenes/scene-machine';
import MenuKeyboard from './input';
import MainMenuLayer from './layer/mainmenu.layer';

export default class MainMenuScene implements Scene {
    public static NAME = 'main-menu';
    name = MainMenuScene.NAME;
    isLoadingScene = false;
    layer: RenderLayer;
    _option = 0;
    camera = new Camera();
    input: MenuKeyboard;

    async load(): Promise<void> {
        const font = await new FontLoader('./img/font.png').load();
        this.layer = new MainMenuLayer(font, this);
        this.input = new MenuKeyboard(this);
    }

    async start(): Promise<void> {
        this.input.listenTo(window);
    }

    update(deltaTime: number): void {}
    draw(context: CanvasRenderingContext2D): void {
        this.layer.draw(context, this.camera, null);
    }

    get option(): number {
        return this._option;
    }

    set option(v: number) {
        const max = 2;
        this._option = (v < 0 ? v + max : v) % max;
    }

    submit(): void {
        SceneMachine.INSTANCE.setScene('forest');
    }
}
