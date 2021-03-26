import Trait from './trait';
/**
 * A Trait Container describes all Entities which can hold traits
 */
export default interface TraitCtnr {
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
}
