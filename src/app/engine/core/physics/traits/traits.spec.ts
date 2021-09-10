import { Entity } from 'feather-engine-entities';
import { mock, when } from 'ts-mockito';
import Gravity from './gravity';
import { getTraits } from './traits';

describe('Traits', () => {
    it('should extract Entities traits', () => {
        const entity = mock<Entity>();
        when(entity.getTrait(Gravity)).thenReturn(mock(Gravity));
        expect(getTraits(entity).gravity).not.toBeNull();
    });
});
