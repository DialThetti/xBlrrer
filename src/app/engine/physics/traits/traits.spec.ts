import { expect } from 'chai';
import Entity from '../../entities/entity';
import { getTraits } from './traits';
import { when, mock } from 'ts-mockito';
import Gravity from './gravity';

describe('Traits', () => {
    it('should extract Entities traits', () => {
        const entity = mock<Entity>();
        when(entity.getTrait(Gravity)).thenReturn(mock(Gravity));
        expect(getTraits(entity).gravity).not.to.be.null;
    });
});
