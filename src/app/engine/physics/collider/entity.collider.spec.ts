import { expect } from 'chai';
import Entity from '../../entities/entity';
import EntityCollider from './entity.collider';
import { spy, anything, verify } from 'ts-mockito';
describe('EntityCollider', () => {
    let collider: EntityCollider;
    const a = ({
        collide: () => {
            /*noop*/
        },
    } as unknown) as Entity;

    beforeEach(() => {
        const set = new Set<Entity>();
        set.add(a);
        collider = new EntityCollider(set);
    });
    it('should be created', () => {
        expect(collider).not.to.be.null;
    });

    describe('check', () => {
        it('should not collide same entities', () => {
            const spyedInstance = spy(a);
            collider.check(a);
            verify(spyedInstance.collide(anything())).never();
        });
        it('should collide with other instances entities', () => {
            const entity = ({
                bounds: { overlaps: () => true },
                collide: () => {
                    /*noop*/
                },
            } as unknown) as Entity;
            const spyedInstance = spy(entity);
            collider.check(entity);
            verify(spyedInstance.collide(anything())).once();
        });
        it('should not collide with other instances entities if not overlapping', () => {
            const entity = ({
                bounds: { overlaps: () => false },
                collide: () => {
                    /*noop*/
                },
            } as unknown) as Entity;
            const spyedInstance = spy(entity);
            collider.check(entity);
            verify(spyedInstance.collide(anything())).never();
        });
    });
});
