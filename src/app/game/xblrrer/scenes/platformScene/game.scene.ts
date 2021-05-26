import Entity from '@engine/core/entities/entity';
import { EntityState } from '@engine/core/entities/entity.state';
import FontLoader from '@engine/core/io/font.loader';
import AudioBoardLoader from '@engine/core/io/sfx/audioboard.loader';
import { LEVEL_RENDERER } from '@engine/level/level-renderer';
import Scene from '@engine/scenes/scene';
import CameraLayer from '@extension/debug/layer/camera.layer';
import ScrollSpyLayer from '@extension/debug/layer/scrollSpy.layer';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlayerController from '@extension/platformer/entities/traits/player-controller';
import PlatformerLevel from '@extension/platformer/level';
import MetroidCamera from '@extension/platformer/world/metroid.camera';
import { KeyboardInput, RenderContext } from 'feather-engine-core';
import { addDebugToLevel } from '../../debug/debug';
import LevelTimer from '../../entities/traits/leveltimer';
import LevelLoader from '../../loader/level.loader';
import DashboardLayer from '../../rendering/layers/dashboard.layer';
import PlatformerKeyListener from './input';

export default class GameScene implements Scene {
    isLoadingScene = false;
    level: PlatformerLevel;

    player: Entity;

    constructor(public name: string) {}

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
        const { level, player, renderer, viewPorts } = await new LevelLoader(this.name).load();
        const audioContext = new AudioContext();

        const audioBoard = await new AudioBoardLoader(audioContext, './sfx/audio.json').load();
        const font = await new FontLoader('./img/font.png').load();
        KeyboardInput.clearKeyListeners();
        KeyboardInput.addKeyListener(new PlatformerKeyListener(player));

        const camera = new MetroidCamera(viewPorts);
        const playerEnv = this.createPlayerEnv(player, level);
        player.state = EntityState.ACTIVE;
        level.entities.add(playerEnv);
        level.audioBoard = audioBoard;
        renderer.push(new CameraLayer(camera), new ScrollSpyLayer(), new DashboardLayer(font, level));
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
