import ImageContainer, { mergeImageContainer } from './image-container';
describe('mergeImageContainer', () => {
  it('should merge 2 Image Container', () => {
    const a = {
      img: null,
      ref: [{ a: {} }],
      animations: { aanim: {} },
    } as unknown as ImageContainer;
    const b = {
      img: null,
      ref: [{ b: {} }],
      animations: { banim: {} },
    } as unknown as ImageContainer;
    const c = mergeImageContainer(a, b);
    expect(c.ref).toStrictEqual([{ a: {} }, { b: {} }]);
    expect(c.animations).toStrictEqual({ aanim: {}, banim: {} });
  });
});
