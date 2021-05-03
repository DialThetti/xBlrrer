import { expect } from 'chai';
import Entity from '../../entities/entity';
import { mock } from 'ts-mockito';
import { Context } from '../../entities/trait';
import Vector from '../../math/vector';
import Physics from './physics';
import Collidable from '../collidable';

describe('Physics', () => {
    const trait = new Physics();

    it('should be named "physics"', () => {
        expect(trait.name).to.equal('physics');
    });

    describe('update', () => {
        const entity = {} as Entity;

        beforeEach(() => {
            entity.vel = new Vector(1, -1);
            entity.pos = new Vector(0, 0);
        });

        it('should do nothing if disabled', () => {
            trait.enabled = false;
            trait.update(entity, { deltaTime: 1, collidable: mock<Collidable>() } as Context);
            expect(entity.pos.y).to.equal(0);
        });
        it('should do nothing if no collidable', () => {
            trait.enabled = true;
            trait.update(entity, { deltaTime: 1 } as Context);
            expect(entity.pos.y).to.equal(0);
        });
        it('should update position', () => {
            trait.enabled = true;
            trait.update(entity, { deltaTime: 1, collidable: mock<Collidable>() } as Context);
            expect(entity.pos.y).to.equal(-1);
            expect(entity.pos.x).to.equal(1);
        });
        it('should consult collidables', () => {
            trait.enabled = true;
            trait.update(entity, {
                deltaTime: 1,
                collidable: {
                    checkX(entity: Entity) {
                        entity.pos.x = 42;
                    },
                    checkY(entity: Entity) {
                        entity.pos.y = 21;
                    },
                },
            } as Context);
            expect(entity.pos.x).to.equal(42);
            expect(entity.pos.y).to.equal(21);
        });
    });
});
