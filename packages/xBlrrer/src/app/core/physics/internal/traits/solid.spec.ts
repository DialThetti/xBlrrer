import { BoundingBox, Vector } from '@dialthetti/feather-engine-core';
import { Entity, Side } from '@dialthetti/feather-engine-entities';
import { PositionedTile } from '../../../level';
import { Solid } from './solid';

describe('Solid', () => {
  const trait = new Solid();

  it('should be named "solid"', () => {
    expect(trait.name).toEqual('solid');
  });

  describe('obstruct', () => {
    const entity = {} as Entity;
    const match = { y: { from: 0, to: 2 }, x: { from: 2, to: 4 } } as PositionedTile;
    beforeEach(() => {
      entity.vel = new Vector(4, 2);
      entity.size = new Vector(5, 5);
      entity.bounds = new BoundingBox(new Vector(0, 0), new Vector(2, 2), new Vector(4, 4));
    });

    it('should do nothing if disabled', () => {
      trait.enabled = false;
      trait.obstruct(entity, Side.BOTTOM, match);
      expect(entity.vel.x).toEqual(4);
      expect(entity.vel.y).toEqual(2);
    });
    it('should obstruct BOTTOM', () => {
      trait.enabled = true;
      trait.obstruct(entity, Side.BOTTOM, match);
      expect(entity.vel.x).toEqual(4);
      expect(entity.vel.y).toEqual(0);
      expect(entity.bounds.top).toEqual(-5);
    });
    it('should obstruct TOP', () => {
      trait.enabled = true;
      trait.obstruct(entity, Side.TOP, match);
      expect(entity.vel.x).toEqual(4);
      expect(entity.vel.y).toEqual(0);
      expect(entity.bounds.top).toEqual(2);
    });
    it('should obstruct LEFT', () => {
      trait.enabled = true;
      trait.obstruct(entity, Side.LEFT, match);
      expect(entity.vel.x).toEqual(0);
      expect(entity.vel.y).toEqual(2);
      expect(entity.bounds.left).toEqual(4);
    });
    it('should obstruct RIGHT', () => {
      trait.enabled = true;
      trait.obstruct(entity, Side.RIGHT, match);
      expect(entity.vel.x).toEqual(0);
      expect(entity.vel.y).toEqual(2);
      expect(entity.bounds.left).toEqual(-3);
    });
  });
});
