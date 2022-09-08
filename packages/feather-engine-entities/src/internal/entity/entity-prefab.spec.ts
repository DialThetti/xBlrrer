import { Vector } from '@dialthetti/feather-engine-core';
import { mock } from 'ts-mockito';
import { Trait } from '../trait/trait';
import { TraitCtnr } from '../trait/trait-container';
import { Entity } from './entity';
import { EntityPrefab } from './entity-prefab';

describe('EntityPrefab', () => {
    let entityPrefab: EntityPrefab;

    let entity: Entity & TraitCtnr;
    class TestEntityPrefab extends EntityPrefab {
        traits = () => [mock<Trait>()];
        size = new Vector(0, 0);
        offset = new Vector(0, 0);

        entityFac = () => entity;
        routeFrame(): string {
            return 'frame';
        }
    }

    beforeEach(() => {
        entityPrefab = new TestEntityPrefab('a');
        entity = mock<Entity & TraitCtnr>();
        entity.size = new Vector(0, 0);
        entity.offset = new Vector(0, 0);
    });
    it('should be created', () => {
        expect(entityPrefab).not.toBeNull();
    });
    describe('flip', () => {
        it('should be false if x>0', () => {
            const flipped = entityPrefab.flipped({ vel: { x: 1 } } as Entity);
            expect(flipped).toBeFalsy();
        });
        it('should be true if x<0', () => {
            const flipped = entityPrefab.flipped({ vel: { x: -1 } } as Entity);
            expect(flipped).toBeTruthy();
        });
    });
    describe('create', () => {
        let entityFac: () => Entity & TraitCtnr;
        it('should create a constructor function for an Entity', async () => {
            entityFac = await entityPrefab.create();
            expect(entityFac).not.toBeNull();
        });
        it('should create a constructor that can create an Entity', () => {
            const entity2: Entity & TraitCtnr = entityFac();
            expect(entity2).not.toBeNull();
        });
    });
});
