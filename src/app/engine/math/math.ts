export function cross<U, V>(xArr: U[], yArr: V[]): [U, V][] {
    return xArr.reduce((acc, x) => acc.concat(yArr.map(y => [x, y])), []);
}

export function intRange(start: number, end: number): number[] {
    if (start >= end) {
        return [];
    }
    return Array.from(Array(end - start).keys()).map(a => a + start);
}

export function random(n: number): number {
    return Math.floor(n * Math.random());
}
