import {
    FeatherEngine,
    KeyboardInput,
    loadImage,
    RenderContext,
    SaveDataSystem,
} from '@dialthetti/feather-engine-core';
import { FontLoader, NineWaySpriteSheetLoader } from '@dialthetti/feather-engine-graphics';
import Level from 'src/app/core/level/level';
import Camera from 'src/app/core/rendering/camera';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';
import Scene from 'src/app/core/scenes/scene';
import SceneMachine from 'src/app/core/scenes/scene-machine';
import AudioBoard from 'src/app/core/sfx/audioboard';
import AudioBoardLoader from 'src/app/core/sfx/audioboard-loader';
import { InitialSaveData, xBlrrerSaveData } from '../../game/save-data';
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

    update(): void {
        //nothing on update atm
    }
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
