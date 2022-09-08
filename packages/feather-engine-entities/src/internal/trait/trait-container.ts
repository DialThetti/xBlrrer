import { Trait } from './trait';

/**
 * A Trait Container describes all Entities which can hold traits
 */
export interface TraitCtnr {
  /**
   * Adds Traits to a Trait Container
   * @param t
   */
  addTraits(traits: Trait[]): void;
  /**
   * Gets a Trait from a Trait Container
   * @param t
   */
  getTrait<T extends Trait>(t: new () => T): T;
  /**
   * Checks if a Trait Container has a Trait
   * @param t
   */
  hasTrait<T extends Trait>(t: new () => T): boolean;

  /**
   * Returns a trait from the trait list.
   * @param name Returns ```true``` if the trait was removed successfully, if not found or not removable for any reason ```false```.
   */
  removeTraitByName(name: string): boolean;
}
