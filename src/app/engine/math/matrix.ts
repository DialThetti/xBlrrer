export default class Matrix<T> {
    grid: T[][] = [];

    set(x: number, y: number, obj: T): void {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }
        this.grid[x][y] = obj;
    }

    get(x: number, y: number): T {
        return this.grid[x] ? this.grid[x][y] : undefined;
    }

    stream(): { x: number; y: number; value: T }[] {
        const l = [];
        this.forEach((x, y, value) => l.push({ x, y, value }));
        return l;
    }
    forEach(func: (x: number, y: number, obj: T) => void): void {
        this.grid.forEach((column, x) => {
            column.forEach((obj, y) => {
                func(x, y, obj);
            });
        });
    }
}
