module.exports = {
    "roots": [
        "<rootDir>/src",
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
    },
    "moduleNameMapper": {
        "\\.(css|scss)$": "identity-obj-proxy",
    },
    "setupFilesAfterEnv": ["<rootDir>/src/enzyme-setup.js"],

};
