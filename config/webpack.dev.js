/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-20 10:52:39
 */
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');

module.exports = require('./webpack.common')({
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [
        new ESLintPlugin({
            fix: true,
            extensions: ['js', 'jsx'],
            exclude: ['/node_modules/', 'build'],
            cache: true,
            cwd: paths.appPath,
        }),
    ],
    stats: 'normal', // 只在发生错误或有新的编译时输出
});
