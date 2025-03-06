export default {
    preset:"ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    verbose: true
};