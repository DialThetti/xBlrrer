import { createAnim } from './animation';

describe('createAnim', () => {
    describe('looping', () => {
        let anim = createAnim(['a', 'b', 'c'], 10, true);
        it('should get normal frames by distance', () => {
            expect(anim(0)).toBe('a');
            expect(anim(5)).toBe('a');
            expect(anim(10)).toBe('b');
            expect(anim(15)).toBe('b');
            expect(anim(20)).toBe('c');
            expect(anim(25)).toBe('c');
        });
        it('should get frames by distance with modulo', () => {
            expect(anim(30)).toBe('a');
            expect(anim(35)).toBe('a');
            expect(anim(40)).toBe('b');
            expect(anim(45)).toBe('b');
            expect(anim(50)).toBe('c');
            expect(anim(55)).toBe('c');
        });
    });
    describe('not looping', () => {
        let anim = createAnim(['a', 'b', 'c'], 10, false);
        it('should get normal frames by distance', () => {
            expect(anim(0)).toBe('a');
            expect(anim(5)).toBe('a');
            expect(anim(10)).toBe('b');
            expect(anim(15)).toBe('b');
            expect(anim(20)).toBe('c');
            expect(anim(25)).toBe('c');
        });
        it('should get frames by distance with modulo', () => {
            expect(anim(30)).toBe('c');
            expect(anim(35)).toBe('c');
        });
    });
});
