import ActivateOnSight from '@engine/core/entities/activateOnSight';
import Entity from '@engine/core/entities/entity';
import { EntityState } from '@engine/core/entities/entity.state';
import { Context } from '@engine/core/entities/trait';
import { Names } from '@engine/core/events/events';
import AudioBoard from '@engine/core/io/sfx/audioboard';
import Level from '@engine/level/level';
import { Vector } from 'feather-engine-core';
import PlatformerEntity from './entities/platformer-entity';
import PlayerController from './entities/traits/player-controller';
import EntityColliderTrait from './level/trait/entity-collider-trait';

export default class PlatformerLevel extends Level {
    name: string;
    entities = new Set<PlatformerEntity>();
    gravity = new Vector(0, 1500);
    width: number;
    height: number;
    time = 0;
    estimateTime: number;
    startPosition: Vector;

    audioBoard: AudioBoard;

    bgm: string;

    paused = false;
    constructor(public tilesize: number) {
        super();
        this.levelTraits.push(new EntityColliderTrait());
    }

    update(deltaTime: number): void {
        super.update(deltaTime);
        this.eventBuffer.process('PauseGame', () => (this.paused = true));
        this.eventBuffer.process('ResumeGame', () => (this.paused = false));
        const context = { deltaTime: this.paused ? 0 : deltaTime, level: this, camera: this.camera };
        this.camera.update(this.findPlayer(), { ...context, deltaTime });
        this.activateEntititesOnSight(context);

        this.getEntities(EntityState.ACTIVE).forEach((e) => e.update(context));

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
}
