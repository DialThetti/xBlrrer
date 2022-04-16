import { determineNewVolume } from './audio-utils';

describe('AudioUtils', () => {
  describe('determineNewVolume', () => {
    describe('with number', () => {
      it('should return a number between 0 and 1 without modification', () => {
        expect(determineNewVolume(0, 1)).toEqual(0);
        expect(determineNewVolume(1, 1)).toEqual(1);
        expect(determineNewVolume(0.3, 1)).toEqual(0.3);
      });
      it('should return 0 if underflow', () => {
        expect(determineNewVolume(-1, 1)).toEqual(0);
        expect(determineNewVolume(-1.1, 1)).toEqual(0);
      });
      it('should return 1 if overflow', () => {
        expect(determineNewVolume(2, 1)).toEqual(1);
        expect(determineNewVolume(1.1, 1)).toEqual(1);
      });
    });
    describe('with string', () => {
      it('should interpret string as delta', () => {
        expect(determineNewVolume('+0.1', 0.5)).toEqual(0.6);
        expect(determineNewVolume('-0.1', 1)).toEqual(0.9);
      });
      it('should return 0 if underflow', () => {
        expect(determineNewVolume('-1', 0.5)).toEqual(0);
      });
      it('should return 1 if overflow', () => {
        expect(determineNewVolume('+1', 0.5)).toEqual(1);
      });
    });
  });
});
