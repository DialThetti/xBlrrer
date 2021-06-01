import ImageContainer, { mergeImageContainer } from './image-container';
describe('mergeImageContainer', () => {
    it('should merge 2 Image Container', () => {
        const a = {
            img: null,
            images: { a: {} },
            animations: { aanim: {} },
        } as unknown as ImageContainer;
        const b = {
            img: null,
            images: { b: {} },
            animations: { banim: {} },
        } as unknown as ImageContainer;
        const c = mergeImageContainer(a, b);
        expect(c.images).toStrictEqual({ a: {}, b: {} });
        expect(c.animations).toStrictEqual({ aanim: {}, banim: {} });
    });
});
