import { TraitAdapter } from '../../../core/entities';
import PlatformerEntity from './platformer-entity';

class TestE extends TraitAdapter {
    counter = 0;
    constructor() {
        super('test');
    }
    doStuff() {
        // noop
    }
}

describe('Entity', () => {
    describe('Traits', () => {
        const e = new PlatformerEntity();
        it('should be addable', () => {
            e.addTrait(new TestE());
            expect(Object.keys(e.traits).length).toEqual(1);
            expect(e.hasTrait(TestE)).not.toBeNull();
        });

        it('should be arranged as object', () => {
            const test = e.getTrait(TestE);
            expect(test.doStuff).not.toBeNull();
        });

        it('should be editable in TraitObject', () => {
            const traitObject = e.getTrait(TestE);
            expect(traitObject.counter).toEqual(0);
            traitObject.counter = 1;
            expect(traitObject.counter).toEqual(1);
            const traitObject2 = e.getTrait(TestE);
            expect(traitObject2.counter).toEqual(1);
        });
    });
});
