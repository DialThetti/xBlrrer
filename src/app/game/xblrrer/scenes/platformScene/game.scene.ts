import Entity from '@engine/core/entities/entity';
import { EntityState } from '@engine/core/entities/entity.state';
import AudioBoardLoader from '@engine/core/io/sfx/audioboard.loader';
import { LEVEL_RENDERER } from '@engine/level/level-renderer';
import Scene from '@engine/scenes/scene';
import CameraLayer from '@extension/debug/layer/camera.layer';
import ScrollSpyLayer from '@extension/debug/layer/scrollSpy.layer';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlayerController from '@extension/platformer/entities/traits/player-controller';
import PlatformerLevel from '@extension/platformer/level';
import MetroidCamera from '@extension/platformer/world/metroid.camera';
import DialogLayer from '@game/xblrrer/rendering/layers/dialog.layer';
import { FeatherEngine, KeyboardInput, RenderContext } from 'feather-engine-core';
import { FontLoader, NineWaySpriteSheetLoader } from 'feather-engine-graphics';
import { addDebugToLevel } from '../../debug/debug';
import LevelTimer from '../../entities/traits/leveltimer';
import LevelLoader from '../../loader/level.loader';
import DashboardLayer from '../../rendering/layers/dashboard.layer';
import PlatformerKeyListener from './input';
import { xBlrrerSaveData } from './save-data';
export default class GameScene implements Scene {
    public static NAME = 'game';
    name = GameScene.NAME;
    isLoadingScene = false;
    level: PlatformerLevel;

    player: Entity;

    constructor() {}

    createPlayerEnv(player: PlatformerEntity, level: PlatformerLevel): PlatformerEntity {
        const playerEnv = new PlatformerEntity();
        const playerControl = new PlayerController(level);
        const levelTimer = new LevelTimer(level);
        playerEnv.state = EntityState.ACTIVE;

        player.pos.set(level.startPosition.x * level.tilesize, level.startPosition.y * level.tilesize);
        playerControl.setPlayer(player);
        playerControl.setCheckpoint(level.startPosition);
        playerEnv.addTraits([playerControl, levelTimer]);
        return playerEnv;
    }
    async load(): Promise<void> {
        let saveData = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().getData();

        const { level, player, renderer, viewPorts } = await new LevelLoader(saveData).load();
        const audioContext = new AudioContext();

        const audioBoard = await new AudioBoardLoader(audioContext, './sfx/audio.json').load();
        const font = await new FontLoader('./img/font.png').load();
        FeatherEngine.eventBus.publish('game-control-input', 'clear');
        KeyboardInput.addKeyListener(new PlatformerKeyListener(player));

        const camera = new MetroidCamera(viewPorts);
        if (saveData.position) {
            level.startPosition.set(saveData.position.x / level.tilesize, saveData.position.y / level.tilesize);
        }
        const playerEnv = this.createPlayerEnv(player, level);
        player.state = EntityState.ACTIVE;
        level.entities.add(playerEnv);
        level.audioBoard = audioBoard;
        const frame = await new NineWaySpriteSheetLoader('./img/frame.png').load();
        renderer.push(
            new CameraLayer(camera),
            new ScrollSpyLayer(),
            new DashboardLayer(font, level),
            new DialogLayer(font, frame, level),
        );
        level.camera = camera;
        this.level = level;

        renderer.forEach((l) => LEVEL_RENDERER.addLayer(l));
        this.player = player;

        addDebugToLevel(level);
    }

    update(deltaTime: number): void {
        this.level.update(deltaTime);
    }

    draw(context: RenderContext): void {
        LEVEL_RENDERER.render(context, this.level);
    }
    async start(): Promise<void> {
        // resetting not required here
    }
}
