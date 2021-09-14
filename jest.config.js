module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '@engine/(.*)': '<rootDir>/src/app/engine/$1',
        '@extension/(.*)': '<rootDir>/src/app/extension/$1',
        '@game/(.*)': '<rootDir>/src/app/game/$1',
    },
};
