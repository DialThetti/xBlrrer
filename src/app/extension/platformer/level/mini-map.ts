export default class MiniMap {
    rooms: Room[][] = [];

    static fromValue(data: number[][]): MiniMap {
        const m = new MiniMap();
        m.rooms = data.map(row => row.map(value => Room.fromValue(value)));
        return m;

    }

    get width(): number {
        return this.rooms[0].length;
    }

    get height(): number {
        return this.rooms.length;
    }
}

export class Room {
    topOpen: boolean = false;
    leftOpen: boolean = false;
    rightOpen: boolean = false;
    bottomOpen: boolean = false;

    get not(): boolean {
        return !(this.topOpen || this.leftOpen || this.rightOpen || this.bottomOpen);
    }
    static fromValue(data: number): Room {
        const room = new Room();

        room.topOpen = (0x8 & data) == 0x8;
        room.leftOpen = (0x4 & data) == 0x4;
        room.rightOpen = (0x2 & data) == 0x2;
        room.bottomOpen = (0x1 & data) == 0x1;

        return room;
    }
}