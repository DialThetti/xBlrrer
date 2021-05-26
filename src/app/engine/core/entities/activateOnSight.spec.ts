import Camera from '../world/camera';
import ActivateOnSight from './activateOnSight';
import Entity from './entity';
import { EntityState } from './entity.state';
import { Context } from './trait';

describe('ActivateOnSight', () => {
    const trait = new ActivateOnSight();
    it('should be named "activateOnSight"', () => {
        expect(trait.name).toEqual('activateOnSight');
    });

    describe('update', () => {
        it('should set Entity to UNTRIGGERED if out of screen', () => {
            const entity = { bounds: { left: 1000, right: 1200 } } as Entity;
            const context = { camera: new Camera() } as Context;
            trait.update(entity, context);
            expect(entity.state).toEqual(EntityState.UNTRIGGERED);
        });
        it('should set Entity to ACTIVE if out of screen', () => {
            const entity = { bounds: { left: -10, right: 10 } } as Entity;
            const context = { camera: new Camera() } as Context;
            trait.update(entity, context);
            expect(entity.state).toEqual(EntityState.ACTIVE);
        });
    });
});
