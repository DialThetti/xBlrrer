import { random, Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityPrefab, EntityState } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';

import { Context, TraitAdapter } from 'src/app/core/entities';
import { Gravity, Physics, Solid } from 'src/app/core/physics';
import { Player } from '../traits';

class Shiny extends TraitAdapter {
    color: string;
    constructor() {
        super('shiny');
        this.color = ['red', 'yellow', 'blue'][random(3)];
    }
}
class Bounce extends TraitAdapter {
    g;
    flyTime = 1;
    constructor() {
        super('bounce');
    }
    obstruct(entity: Entity): void {
        this.finalize = (): void => {
            entity.vel.y = this.g;
            entity.vel.x /= 2;
            this.g /= 2;
        };

    }
    update(entity: Entity, context: Context): void {
        if (!this.g)
            this.g = entity.vel.y;
        this.flyTime -= context.deltaTime;

    }
    collides(entity: Entity, target: Entity): void {
        if (!target.getTrait(Player)) {
            return;
        }
        if (this.flyTime < 0) {
            entity.state = EntityState.READY_TO_REMOVE;
            //shiny count ++
        }
    }
}
export class ShinyPrefab extends EntityPrefab {
    constructor() {
        super('shiny', 'shiny');
        this.size = new Vector(5, 5);
        this.offset = new Vector(0, 0);
        this.traits = (): TraitAdapter[] => [
            new Solid(),
            new Gravity(),
            new Bounce(),
            new Physics(),
            new Shiny()
        ];
    }
    entityFac = (): Entity => new PlatformerEntity() as Entity;

    routeFrame(entity: Entity): string {
        return entity.getTrait(Shiny).color;

    }


}
