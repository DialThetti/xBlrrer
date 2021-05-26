import { mock, when } from 'ts-mockito';
import Entity from '../../entities/entity';
import Gravity from './gravity';
import { getTraits } from './traits';

describe('Traits', () => {
    it('should extract Entities traits', () => {
        const entity = mock<Entity>();
        when(entity.getTrait(Gravity)).thenReturn(mock(Gravity));
        expect(getTraits(entity).gravity).not.toBeNull();
    });
});
