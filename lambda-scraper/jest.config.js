module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/',
    ],
    moduleFileExtensions: ['ts', 'js'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/out/build/'
    ],
};