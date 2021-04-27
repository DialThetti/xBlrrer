import Entity from '../../../engine/entities/entity';
import { EntityState } from '../../../engine/entities/entity.state';
import FontLoader from '../../../engine/io/font.loader';
import AudioBoardLoader from '../../../engine/io/sfx/audioboard.loader';
import CameraLayer from '../../../engine/rendering/layers/camera.layer';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';
import ScrollSpyLayer from '../../../engine/rendering/layers/scrollSpy.layer';
import Camera from '../../../engine/world/camera';
import PlatformerEntity from '../../../platformer/entities/platformer-entity';
import PlayerController from '../../../platformer/entities/traits/player-controller';
import Level from '../../../platformer/level';
import MetroidCamera from '../../../platformer/world/metroid.camera';
import Scene from '../../../scenes/scene';
import { addDebugToLevel } from '../../debug/debug';
import LevelTimer from '../../entities/traits/leveltimer';
import setupKeyboard from '../../io/input';
import LevelLoader from '../../loader/level.loader';
import DashboardLayer from '../../rendering/layers/dashboard.layer';

declare const window: any; // eslint-disable-line
export default class GameScene implements Scene {
    isLoadingScene = false;
    camera: Camera;
    level: Level;

    renderer: RenderLayer;
    player: Entity;

    constructor(public name: string) {}

    createPlayerEnv(player: PlatformerEntity, level: Level): PlatformerEntity {
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
        const input = setupKeyboard(player);
        input.listenTo(window);

        const camera = new MetroidCamera(viewPorts);
        const playerEnv = this.createPlayerEnv(player, level);
        player.state = EntityState.ACTIVE;
        level.entities.add(playerEnv);
        level.audioBoard = audioBoard;
        renderer.layers.push(new CameraLayer(camera), new ScrollSpyLayer(), new DashboardLayer(font, level));
        this.camera = camera;
        this.level = level;
        this.renderer = renderer;
        this.player = player;

        addDebugToLevel(level);
    }

    update(deltaTime: number): void {
        this.level.update(deltaTime, this.camera);
    }

    draw(context: CanvasRenderingContext2D): void {
        this.renderer.draw(context, this.camera, this.player);
    }
    async start(): Promise<void> {
        // resetting not required here
    }
}
