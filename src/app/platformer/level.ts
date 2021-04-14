import ActivateOnSight from '../engine/entities/activateOnSight';
import Entity from '../engine/entities/entity';
import { EntityState } from '../engine/entities/entity.state';
import { Context } from '../engine/entities/trait';
import { Names } from '../engine/events/events';
import AudioBoard from '../engine/io/sfx/audioboard';
import Matrix from '../engine/math/matrix';
import Vector from '../engine/math/vector';
import Collidable from '../engine/physics/collidable';
import Camera from '../engine/world/camera';
import Tile from '../engine/world/tiles/tile';
import PlatformerEntity from './entities/platformer-entity';
import PlayerController from './entities/traits/player-controller';
import LevelCollider from './level.collider';

export default class Level implements Collidable {
    name: string;
    entities = new Set<PlatformerEntity>();
    gravity = new Vector(0, 1500);

    time = 0;
    estimateTime: number;
    startPosition: Vector;

    audioBoard: AudioBoard;

    collider: LevelCollider;

    bgm: string;

    constructor(public tilesize: number) {
        this.collider = new LevelCollider(this);
    }

    update(deltaTime: number, camera: Camera): void {
        const context = { deltaTime, level: this, collidable: this, camera };
        this.updateCameraPosition(camera, this.findPlayer());
        this.activateEntititesOnSight(context);

        this.getEntities(EntityState.ACTIVE).forEach((e) => e.update(context));

        this.entities.forEach((e) => this.collider.entityCollider.check(e));

        this.getEntities(EntityState.READY_TO_REMOVE).forEach((r) => this.entities.delete(r));
        // garbage collection if too many entities
        const activeEntities = this.getEntities(EntityState.ACTIVE);
        const removing = Math.max(0, activeEntities.length - 150);
        if (removing > 0) {
            activeEntities
                .filter((a) => a.hasTrait(ActivateOnSight))
                .slice(0, removing)
                .forEach((r) => (r.state = EntityState.UNTRIGGERED));
            console.warn('removing ' + removing + ' active Entities');
        }
        if (this.time === 0) this.init();

        this.time += deltaTime;

        this.getEntities(EntityState.ACTIVE).forEach((e) => {
            e.events.process(Names.playSFX, ({ name, blocking }: { name: string; blocking: boolean }): void =>
                this.audioBoard.playAudio(name, blocking),
            );
            e.events.process(Names.spawn, (payload: { entity: PlatformerEntity }) => {
                this.entities.add(payload.entity);
            });
        });
    }

    private updateCameraPosition(camera: Camera, playerFigure: Entity): void {
        if (camera.xAllowed) {
            const right = playerFigure.bounds.right - camera.box.right + camera.edge.x;
            const left = playerFigure.bounds.left - camera.box.left - camera.edge.x;
            camera.pos.x += Math.max(right, Math.min(left, 0));
        }
        // if backward is allowed
        if (camera.yAllowed) {
            const bottom = playerFigure.bounds.bottom - camera.box.bottom + camera.edge.y;
            const top = playerFigure.bounds.top - camera.box.top - camera.edge.y;
            camera.pos.y += Math.max(bottom, Math.min(top, 0));
        }

        camera.pos.set(Math.floor(Math.max(camera.pos.x, 0)), Math.floor(Math.max(camera.pos.y, 0)));
    }

    private getEntities(state: EntityState): PlatformerEntity[] {
        return [...this.entities].filter((e) => e.state === state);
    }

    private activateEntititesOnSight(context: Context): void {
        [...this.entities]
            .filter((e) => e.hasTrait(ActivateOnSight))
            .forEach((e) => e.getTrait(ActivateOnSight).update(e, context));
    }

    findPlayer(): Entity {
        return [...this.entities]
            .filter((e) => e.hasTrait(PlayerController))
            .map((e) => e.getTrait(PlayerController).player)[0];
    }

    private init(): void {
        //  if (this.bgm) this.audioBoard.playBGM(this.bgm);
    }

    checkX(entity: Entity): void {
        this.collider.checkX(entity);
    }
    checkY(entity: Entity): void {
        this.collider.checkY(entity);
    }

    set tiles(tiles: Matrix<Tile>) {
        this.collider.tiles = tiles;
    }
}
