/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-21 20:34:10
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
                chunks: 'all', // 默认作用于异步chunk
                minSize: 0, // 默认值是30kb,代码块的最小尺寸
                minChunks: 1, // 被多少模块共享,表示被引用次数，默认为1
                maxAsyncRequests: 2, // 限制异步模块内部的并行最大请求数的，默认为5
                maxInitialRequests: 4, // 限制入口的拆分数量 一个入口最大的并行请求数，默认为3
                automaticNameDelimiter: '~', // 默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
                cacheGroups: {
                    vendors: {
                        chunks: 'all',
                        test: /node_modules/,
                        priority: -10, /// 优先级，
                    },
                    commons: {
                        chunks: 'all',
                        minSize: 0, // 最小提取字节数
                        minChunks: 2, // 最少被几个chunk引用
                        priority: -20,
                    },
                },
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
