/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-20 15:11:24
 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空build目录文件
const ProgressBarPlugin = require('progress-bar-webpack-plugin');// 打包进度条美化
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// const smw = new SpeedMeasureWebpackPlugin();

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
        // new ImageMinimizerPlugin({
        //     minimizerOptions: {
        //         plugins: [
        //             ['gifsicle', { interlaced: true }],
        //             ['jpegtran', { progressive: true }],
        //             ['optipng', { optimizationLevel: 5 }],
        //             [
        //                 'svgo',
        //                 {
        //                     plugins: [
        //                         {
        //                             removeViewBox: false,
        //                         },
        //                     ],
        //                 },
        //             ],
        //         ],
        //     },
        // }),
        // new MiniCssExtractPlugin({
        //     filename: 'css/[name].[contenthash:8].css',
        //     chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        //     ignoreOrder: true,
        // }),
    ],
    stats: 'normal', // 标准输出
});
