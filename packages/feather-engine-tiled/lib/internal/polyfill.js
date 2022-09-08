"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = exports.flatMap = void 0;
function flatMap(array) {
    return array.reduce((acc, x) => acc.concat(x), []);
}
exports.flatMap = flatMap;
function distinct(t) {
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    return t.filter(onlyUnique);
}
exports.distinct = distinct;
