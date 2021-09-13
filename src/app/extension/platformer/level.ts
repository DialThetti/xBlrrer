import ActivateOnSight from '@engine/core/entities/activateOnSight';
import { Names, SpawnEvent } from '@engine/core/entities/events';
import { Context } from '@engine/core/entities/trait';
import Level from '@engine/level/level';
import { FeatherEngine, GAME_CONTROL_TOPIC, Vector } from 'feather-engine-core';
import { Entity, EntityState } from 'feather-engine-entities';
import { Subject } from 'feather-engine-events';
import AudioBoard from 'src/app/core/sfx/audioboard';
import { PLAY_SFX_TOPIC, SfxEvent } from 'src/app/core/sfx/events';
import PlayerController from './entities/traits/player-controller';
import EntityColliderTrait from './level/trait/entity-collider-trait';

export default class PlatformerLevel extends Level {
    name: string;
    entities = new Set<Entity>();
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
        FeatherEngine.eventBus.subscribe(GAME_CONTROL_TOPIC, {
            receive: (subject: Subject<string>) => {
                if (subject.payload === 'pause') {
                    this.paused = true;
                }
                if (subject.payload === 'resume') {
                    this.paused = false;
                }
            },
        });
        const context = { deltaTime: this.paused ? 0 : deltaTime, level: this, camera: this.camera };
        this.camera.update(this.findPlayer(), deltaTime);
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
            e.events.process(PLAY_SFX_TOPIC, {
                receive: (sfxEvent: SfxEvent): void => {
                    const { name, blocking, position } = sfxEvent.payload;
                    this.audioBoard.playAudio(name, blocking, position);
                },
            });
            e.events.process(Names.spawn, {
                receive: (spawnEvent: SpawnEvent) => {
                    this.entities.add(spawnEvent.payload.entity);
                },
            });
        });
    }

    private getEntities(state: EntityState): Entity[] {
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
