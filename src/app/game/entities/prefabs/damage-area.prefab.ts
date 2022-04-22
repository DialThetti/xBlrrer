import { Entity, EntityPrefab, EntityState } from "@dialthetti/feather-engine-entities";
import { SpriteSheet } from "@dialthetti/feather-engine-graphics";
import PlatformerEntity from "@extension/platformer/entities/platformer-entity";
import { Context, TraitAdapter } from "src/app/core/entities";
import { Killable } from "../traits";

export class TTL extends TraitAdapter {
    public time = 1;

    constructor() {
        super('ttl');
    }

    update(entity: Entity, context: Context): void {
        this.time -= context.deltaTime;
        if (this.time <= 0) {
            entity.state = EntityState.READY_TO_REMOVE
        }
    }
}

export class Damaging extends TraitAdapter {

    targetedEntitySet = new Set<Entity>();
damage = 1;
    constructor(){
        super('damaging');
    }

    collides(entity: Entity, target: Entity): void {
        if(!this.targetedEntitySet.has(target))   {
            this.targetedEntitySet.add(target);
            target.getTrait(Killable)?.kill(this.damage);
        }
    }
}

export class DamageArea extends EntityPrefab {


    constructor() {
        super('damage-area', '');
        this.traits = () => [new TTL(), new Damaging()];
    }
    entityFac = (): PlatformerEntity => new PlatformerEntity();

    routeFrame(entity: Entity, sprite: SpriteSheet): string {
        return '';
    }
}