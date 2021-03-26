export function notNull(obj: unknown): boolean {
    return !!obj;
}

export function flatMap<T>(array: T[][]): T[] {
    return array.reduce((acc, x) => acc.concat(x), []);
}
