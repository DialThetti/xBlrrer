import AudioBoard from '@engine/core/io/sfx/audioboard';
import AudioBoardLoader from '@engine/core/io/sfx/audioboard.loader';
import Camera from '@engine/core/world/camera';
import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import Scene from '@engine/scenes/scene';
import SceneMachine from '@engine/scenes/scene-machine';
import { FeatherEngine, KeyboardInput, RenderContext } from 'feather-engine-core';
import { FontLoader } from 'feather-engine-graphics';
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

    async load(): Promise<void> {
        const font = await new FontLoader('./img/font.png').load();
        this.layer = new MainMenuLayer(font, this);
        this.audioBoard = await new AudioBoardLoader(new AudioContext(), './sfx/audio.json').load();
        this.audioBoard.setVolume(0.5);
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
        const max = 2;
        this._option = (v < 0 ? v + max : v) % max;
    }

    submit(): void {
        const sav = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>();
        this.audioBoard.playAudio('confirm', true, 0);
        switch (this.option) {
            case 0:
                sav.loadCurrentData(0);
                break;
            case 1:
                sav.clearData();
                sav.pushData(this.newGame());
        }
        SceneMachine.INSTANCE.setScene('game');
    }

    newGame(): Partial<xBlrrerSaveData> {
        return InitialSaveData;
    }
}
