/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-19 13:40:21
 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空build目录文件
const ProgressBarPlugin = require('progress-bar-webpack-plugin');// 打包进度条美化
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css

const chalk = require('chalk');

module.exports = require('./webpack.common')({
    mode: 'production',
    devtool: 'hidden-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new ProgressBarPlugin({
            format: `${chalk.green.bold('build[:bar]')} ${chalk.green.bold(':percent')} (:elapsed seconds)`,
            clear: false,
            width: 60,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            ignoreOrder: true,
        }),
    ],
    stats: 'normal', // 标准输出
});
