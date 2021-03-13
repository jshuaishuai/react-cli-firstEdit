/*
 * @Descripttion:
 * @Author: Jason
 * @LastEditTime: 2021-03-13 20:10:53
 */
const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const imageInlineSizeLimit = 4 * 1024;

module.exports = function (options) {
    const isEnvDevelopment = options.mode === 'development';
    const isEnvProduction = options.mode === 'production';

    return {
        mode: options.mode,
        entry: paths.appSrc,
        output: {
            path: paths.appBuild,
            publicPath: '/',
        },
        cache: { // 使用持久化缓存
            type: 'filesystem',//memory:缓存大内存 filesystem：缓存到node_moudules文件
        },
        devtool: options.devtool,
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.(js|jsx)$/,
                            exclude: /node_modules/,
                            use: [
                                {
                                    loader: 'babel-loader',
                                    options: {
                                        presets: [
                                            "@babel/preset-env",
                                            "@babel/preset-react"
                                        ]
                                    },
                                }
                            ],
                        },
                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: ['style-loader', {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                                }
                            }, 'postcss-loader']
                        },
                        {
                            test: sassRegex,
                            exclude: sassModuleRegex,
                            use: ['style-loader', {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1 // 查询参数 importLoaders，用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader
                                }
                            }, 'postcss-loader', 'sass-loader'],
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit // 4kb
                                }
                            }
                        },
                        {
                            test: /\.(eot|svg|ttf|woff|woff2?)$/,
                            type: 'asset/resource'
                        },
                    ]
                }

            ]
        },
        devServer: {},
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new webpack.DefinePlugin({
                'NODE_ENV': isEnvProduction && JSON.stringify('production'), // 设置全局
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            ...options.plugins,
        ],
        stats: options.stats,// 打包日志发生错误和新的编译时输出
        performance: false,
        resolve: {
            modules: [paths.appNodeModules],
            extensions: ['.js', '.jsx', '.react.js'],
            mainFields: ['browser', 'jsnext:main', 'main'],
            alias: {
                moment$: 'moment/moment.js',
                '@src': paths.appSrc,
                '@public': paths.appPublic,
            },
        },
    }
}

