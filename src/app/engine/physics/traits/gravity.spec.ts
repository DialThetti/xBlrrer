import { expect } from 'chai';
import Entity from '../../entities/entity';
import { Context } from '../../entities/trait';
import Vector from '../../math/vector';
import Gravity from './gravity';

describe('Gravity', () => {
    let trait = new Gravity();

    it('should be named "gravity"', () => {
        expect(trait.name).to.equal('gravity');
    });

    describe('update', () => {
        let entity = {} as Entity;

        beforeEach(() => {
            entity.vel = new Vector(0, 0);
        });

        it('should do nothing if disabled', () => {
            trait.enabled = false;
            trait.update(entity, { deltaTime: 1 } as Context);
            expect(entity.vel.y).to.equal(0);
        });
        it('should add gravity to Entity velocity', () => {
            trait.enabled = true;
            trait.update(entity, { deltaTime: 1 } as Context);
            expect(entity.vel.y).to.equal(1500);
        });
    });
});
