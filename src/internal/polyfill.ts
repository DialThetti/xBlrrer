export function flatMap<T>(array: T[][]): T[] {
    return array.reduce((acc, x) => acc.concat(x), []);
}

export function distinct<T>(t: T[]): T[] {
    function onlyUnique(value:any, index:any, self:any[]) {
        return self.indexOf(value) === index;
    }
    return t.filter(onlyUnique);
}
