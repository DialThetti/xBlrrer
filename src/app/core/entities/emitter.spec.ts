import { Entity } from '@dialthetti/feather-engine-entities';
import { anything, mock, spy, verify } from 'ts-mockito';
import Emitter from './emitter';
import { Context } from './trait';

describe('Emmiter', () => {
    let emitter;
    let emitterSpy;
    beforeEach(() => {
        emitter = new Emitter();
        emitterSpy = spy(emitter);
    });

    it('should be created', () => {
        expect(emitter).not.toBeNull();
    });
    describe('update', () => {
        it('should not emit if time below interval', () => {
            const entity = mock<Entity>();
            const context = mock<Context>();
            context.deltaTime = 0.1;
            emitter.update(entity, context);
            verify(emitterSpy.emit(anything())).never();
        });
        it('should emit if time above interval each time', () => {
            const entity = mock<Entity>();
            const context = mock<Context>();
            context.deltaTime = 3;
            emitter.update(entity, context);
            emitter.update(entity, context);
            verify(emitterSpy.emit(anything())).twice();
        });
        it('should emit if time above interval only time', () => {
            emitter = new Emitter(null, false);
            emitterSpy = spy(emitter);
            const entity = mock<Entity>();
            const context = mock<Context>();
            context.deltaTime = 3;
            emitter.update(entity, context);
            emitter.update(entity, context);
            verify(emitterSpy.emit(anything())).once();
        });
    });
});
