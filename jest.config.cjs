module.exports = {
    testEnvironment: 'jsdom',
    transform: {},
    testMatch: ['**/__tests__/**/*.test.{js,jsx}'],
    verbose: true,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
