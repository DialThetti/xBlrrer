import Entity from '../../../engine/entities/entity';
import { EntityState } from '../../../engine/entities/entity.state';
import FontLoader from '../../../engine/io/font.loader';
import AudioBoardLoader from '../../../engine/io/sfx/audioboard.loader';
import CameraLayer from '../../../engine/rendering/layers/camera.layer';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';
import ScrollSpyLayer from '../../../engine/rendering/layers/scrollSpy.layer';
import Camera from '../../../engine/world/camera';
import EntityImpl from '../../../platformer/entities/entity';
import Level from '../../../platformer/level';
import LevelLoader from '../../../platformer/loader/level.loader';
import Scene from '../../../scenes/scene';
import LevelTimer from '../../entities/traits/leveltimer';
import Player from '../../entities/traits/player';
import PlayerController from '../../entities/traits/playerController';
import setupKeyboard from '../../io/input';
import DashboardLayer from '../../rendering/layers/dashboard.layer';

export default class GameScene implements Scene {
    isLoadingScene = false;
    camera: Camera;
    level: Level;

    renderer: RenderLayer;
    player: Entity;

    constructor(public name: string) {}

    createPlayerEnv(player: EntityImpl, level: Level): EntityImpl {
        const playerEnv = new EntityImpl();
        const playerControl = new PlayerController(level);
        const levelTimer = new LevelTimer(level);
        playerEnv.state = EntityState.ACTIVE;
        playerControl.setPlayer(player);
        playerControl.setCheckpoint(level.startPosition);
        playerEnv.addTraits([playerControl, levelTimer]);
        return playerEnv;
    }
    async load(): Promise<void> {
        const { level, player, renderer } = await new LevelLoader(this.name).load();
        const audioContext = new AudioContext();

        const audioBoard = await new AudioBoardLoader(audioContext, './sfx/audio.json').load();
        const font = await new FontLoader('./img/font.png').load();
        const input = setupKeyboard(player);
        input.listenTo(window);

        const camera = new Camera();
        camera.yAllowed = true;
        const playerEnv = this.createPlayerEnv(player, level);
        player.state = EntityState.ACTIVE;
        level.entities.add(playerEnv);
        level.audioBoard = audioBoard;
        renderer.layers.push(
            new CameraLayer(camera),
            new ScrollSpyLayer(camera),
            new DashboardLayer(font, () => ({
                ...player.getTrait(Player),
                time: playerEnv.getTrait(LevelTimer).restTime,
                level: level.name,
                coins: player.getTrait(Player).coins,
            })),
        );
        this.camera = camera;
        this.level = level;
        this.renderer = renderer;
        this.player = player;
    }

    update(deltaTime: number): void {
        this.level.update(deltaTime, this.camera);
    }

    draw(context: CanvasRenderingContext2D, deltaTime: number): void {
        this.renderer.draw(context, this.camera, this.player);
    }
    async start(): Promise<void> {}
}
