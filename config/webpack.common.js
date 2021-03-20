/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-20 15:49:25
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const paths = require('./paths');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const imageInlineSizeLimit = 4 * 1024;

module.exports = (options) => {
    const plugins = [];
    // const isEnvDevelopment = options.mode === 'development';
    const isEnvProduction = options.mode === 'production';

    if (isEnvProduction) {
        plugins.push(new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            ignoreOrder: true,
        }))
    }
    return {
        mode: options.mode,
        entry: paths.appSrc,
        output: {
            path: paths.appBuild,
            publicPath: '/',
            assetModuleFilename: 'images/[hash][ext][query]',
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
                                    options: {
                                        cacheDirectory: true,
                                    },
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
                                        sourceMap: true,
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
                                        sourceMap: true,
                                    },
                                },
                                'postcss-loader',
                                'sass-loader',
                            ],
                        },
                        {
                            test: /\.(gif|png|jpe?g|svg|webp)$/i,
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit, // 4kb
                                },
                            },
                            // use: [
                            //     {
                            //         loader: 'image-webpack-loader',
                            //         options: {
                            //             mozjpeg: {
                            //                 progressive: true,
                            //                 quality: 65,
                            //             },
                            //             optipng: {
                            //                 enabled: false,
                            //             },
                            //             pngquant: {
                            //                 quality: '65-90',
                            //                 speed: 4,
                            //             },
                            //             gifsicle: {
                            //                 interlaced: false,
                            //             },
                            //             webp: {
                            //                 quality: 75,
                            //             },
                            //         },
                            //     },
                            // ],
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
            moduleIds: 'deterministic', // 默认 根据模块名称生成简短的hash值
            chunkIds: 'deterministic',
            minimize: isEnvProduction,
            minimizer: [
                new CssMinimizerPlugin({
                    parallel: true, // 开启多线程压缩
                }),
                new TerserPlugin({
                    parallel: true, // 开启多线程压缩
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: 'all',
            },
            runtimeChunk: {
                name: (entrypoint) => `runtime-${entrypoint.name}`,
            },
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
            ...plugins,
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
                '@/src': paths.appSrc,
            },
        },
    };
};
