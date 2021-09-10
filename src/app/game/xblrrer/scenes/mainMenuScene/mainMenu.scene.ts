import AudioBoard from '@engine/core/io/sfx/audioboard';
import AudioBoardLoader from '@engine/core/io/sfx/audioboard.loader';
import Camera from '@engine/core/world/camera';
import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import Scene from '@engine/scenes/scene';
import SceneMachine from '@engine/scenes/scene-machine';
import { FeatherEngine, KeyboardInput, loadImage, RenderContext, SaveDataSystem } from 'feather-engine-core';
import { FontLoader, NineWaySpriteSheetLoader } from 'feather-engine-graphics';
import { InitialSaveData, xBlrrerSaveData } from '../platformScene/save-data';
import MenuKeyboard from './input';
import MainMenuLayer from './layer/mainmenu.layer';

export default class MainMenuScene implements Scene {
    public static NAME = 'main-menu';
    name = MainMenuScene.NAME;
    isLoadingScene = false;
    layer: RenderLayer;
    _option = 0;
    audioBoard: AudioBoard;
    camera = new Camera();
    sav: SaveDataSystem<xBlrrerSaveData>;

    async load(): Promise<void> {
        this.sav = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>();
        const font = await new FontLoader('./img/font.png').load();
        const title = await loadImage('./img/title.png');
        const nineway = await new NineWaySpriteSheetLoader('./img/frame.png').load();
        this.layer = new MainMenuLayer(font, title, nineway, this);
        this.audioBoard = await new AudioBoardLoader(new AudioContext(), './sfx/audio.json').load();
        this.audioBoard.setVolume(0.5);
        if (!this.sav.hasData(0)) {
            this._option = 1;
            return;
        }
    }

    async start(): Promise<void> {
        KeyboardInput.addKeyListener(new MenuKeyboard(this));
    }

    update(deltaTime: number): void {}
    draw(context: RenderContext): void {
        this.layer.draw(context, { camera: this.camera } as Level);
    }

    get option(): number {
        return this._option;
    }

    set option(v: number) {
        if (!this.sav.hasData(0)) {
            this._option = 1;
            return;
        }
        const max = 2;
        this._option = (v < 0 ? v + max : v) % max;
    }

    submit(): void {
        this.audioBoard.playAudio('confirm', true, 0);
        switch (this.option) {
            case 0:
                if (this.sav.hasData(0)) {
                    this.sav.loadCurrentData(0);
                }
                break;
            case 1:
                this.sav.clearData();
                this.sav.pushData(this.newGame());
        }
        SceneMachine.INSTANCE.setScene('game');
    }

    newGame(): Partial<xBlrrerSaveData> {
        return InitialSaveData;
    }
}
