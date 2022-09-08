export default class Matrix<T> {
    grid: T[][] = [];

    set(x: number, y: number, obj: T): void {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }
        this.grid[x][y] = obj;
    }

    get(x: number, y: number): T | undefined {
        return this.grid[x] ? this.grid[x][y] : undefined;
    }

    forEach(func: (x: number, y: number, obj: T) => void): void {
        this.grid.forEach((column, x) => {
            column.forEach((obj, y) => {
                func(x, y, obj);
            });
        });
    }
}
