import Trait from '@engine/entities/trait';
import { expect } from 'chai';
import PlatformerEntity from './platformer-entity';
class TestE extends Trait {
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
            expect(Object.keys(e.traits).length).to.equal(1);
            expect(e.hasTrait(TestE)).to.not.null;
        });

        it('should be arranged as object', () => {
            const test = e.getTrait(TestE);
            expect(test.doStuff).to.not.null;
        });

        it('should be editable in TraitObject', () => {
            const traitObject = e.getTrait(TestE);
            expect(traitObject.counter).to.equal(0);
            traitObject.counter = 1;
            expect(traitObject.counter).to.equal(1);
            const traitObject2 = e.getTrait(TestE);
            expect(traitObject2.counter).to.equal(1);
        });
    });
});
