module.exports = {
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testEnvironment: 'node',
    testRegex: '/test/.*.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    "moduleNameMapper": {
        "@/(.*)": "<rootDir>/src/$1",
        "@backend/(.*)": "<rootDir>/src/backend/$1"
    }
};
