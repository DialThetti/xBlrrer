import { FeatherEngine, GAME_CONTROL_TOPIC, Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityState } from '@dialthetti/feather-engine-entities';
import { Subject } from '@dialthetti/feather-engine-events';
import PlayerController from '@game/entities/traits/player-controller';
import { ActivateOnSight } from 'src/app/core/entities';
import { Names, SpawnEvent } from 'src/app/core/entities/events';
import { Context } from 'src/app/core/entities/trait';
import Level from 'src/app/core/level/level';
import { PlayBgmEvent } from 'src/app/core/sfx';
import MiniMap from './mini-map';
import EntityColliderTrait from './trait/entity-collider-trait';

export default class PlatformerLevel extends Level {
    name: string;
    entities = new Set<Entity>();
    gravity = new Vector(0, 1500);
    width: number;
    height: number;
    time = 0;
    estimateTime: number;
    startPosition: Vector;

    bgm: string;

    paused = false;

    miniMap: MiniMap;

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
        if (this.bgm) {
            FeatherEngine.eventBus.publish(new PlayBgmEvent({ name: this.bgm }));
        }
    }
}
