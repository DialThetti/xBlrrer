import { Vector } from 'feather-engine-core';
import { Entity } from 'feather-engine-entities';
import { Context } from '../../entities/trait';
import Gravity from './gravity';

describe('Gravity', () => {
    const trait = new Gravity();

    it('should be named "gravity"', () => {
        expect(trait.name).toEqual('gravity');
    });

    describe('update', () => {
        const entity = {} as Entity;

        beforeEach(() => {
            entity.vel = new Vector(0, 0);
        });

        it('should add gravity to Entity velocity', () => {
            trait.update(entity, { deltaTime: 1 } as Context);
            expect(entity.vel.y).toEqual(1500);
        });
    });
});
