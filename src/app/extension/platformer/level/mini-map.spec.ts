import { Room } from './mini-map';
describe('Room', () => {

    describe('fromValue', () => {
        it('should work for 15', () => {
            const room = Room.fromValue(15);
            expect(room.topOpen).toBeTruthy();
            expect(room.leftOpen).toBeTruthy();
            expect(room.rightOpen).toBeTruthy();
            expect(room.bottomOpen).toBeTruthy();
        });
        it('should work for 0', () => {
            const room = Room.fromValue(0);
            expect(room.topOpen).toBeFalsy();
            expect(room.leftOpen).toBeFalsy();
            expect(room.rightOpen).toBeFalsy();
            expect(room.bottomOpen).toBeFalsy();
        });
        it('should work for 0b0110', () => {
            const room = Room.fromValue(0b0110);
            expect(room.topOpen).toBeFalsy();
            expect(room.leftOpen).toBeTruthy();
            expect(room.rightOpen).toBeTruthy();
            expect(room.bottomOpen).toBeFalsy();
        })
    })
})