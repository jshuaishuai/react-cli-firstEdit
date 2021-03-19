/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-19 13:23:49
 */
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "entry",
                corejs: "3.9.1",
                targets: {
                    chrome: "58",
                    ie: "11",
                },
            },
        ],
        [
            "@babel/preset-react",
            {
                development: process.env.NODE_ENV === "development",
            },
        ],
    ],
    plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        "@babel/plugin-syntax-dynamic-import",
    ],
};

