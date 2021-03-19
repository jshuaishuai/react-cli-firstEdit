/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-19 17:58:41
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const paths = require('./paths');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const imageInlineSizeLimit = 4 * 1024;

module.exports = (options) => {
    // const isEnvDevelopment = options.mode === 'development';
    const isEnvProduction = options.mode === 'production';

    return {
        mode: options.mode,
        entry: paths.appSrc,
        output: {
            path: paths.appBuild,
            publicPath: '/',
        },
        cache: {
            // 使用持久化缓存
            type: 'filesystem', // memory:缓存大内存 filesystem：缓存到node_moudules文件
        },
        devtool: options.devtool,
        module: {
            rules: [
                // {
                //     test: /\.(js|jsx)$/,
                //     enforce: 'pre',
                //     exclude: /node_modules/,
                //     loader: 'eslint-loader',
                //     options: {
                //         fix: true, // 启用ESLint自动修复功能
                //         cache: true,
                //     },
                // },
                {
                    oneOf: [
                        {
                            test: /\.(js|jsx)$/,
                            exclude: /node_modules/,
                            use: [
                                {
                                    loader: 'babel-loader',
                                },
                            ],
                        },
                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: [
                                isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                    },
                                },
                                'postcss-loader',
                            ],
                        },
                        {
                            test: sassRegex,
                            exclude: sassModuleRegex,
                            use: [
                                isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                    },
                                },
                                'postcss-loader',
                                'sass-loader',
                            ],
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit, // 4kb
                                },
                            },
                        },
                        {
                            test: /\.(eot|svg|ttf|woff|woff2?)$/,
                            type: 'asset/resource',
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new CssMinimizerPlugin({
                    parallel: true, // 开启多线程压缩
                }),
            ],
        },
        devServer: {},
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
            new webpack.DefinePlugin({
                NODE_ENV: isEnvProduction && JSON.stringify('production'), // 设置全局
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            ...options.plugins,
        ],
        stats: options.stats, // 打包日志发生错误和新的编译时输出
        performance: false,
        resolve: {
            modules: [paths.appNodeModules],
            extensions: ['.js', '.jsx', '*'],
            mainFields: ['browser', 'jsnext:main', 'main'],
            alias: {
                moment$: 'moment/moment.js',
                '@/': paths.appSrc,
            },
        },
    };
};
