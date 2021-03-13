/*
 * @Descripttion: 
 * @Author: Jason
 * @LastEditTime: 2021-03-13 11:54:15
 */
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');

// webpack开发 配置文件
const webpackConfig = require('../config/webpack.dev');
// 自定义日志输出
const logger = require('./logger');
// 服务配置
const appConfig = require('./appConfig');

const { port, host } = appConfig; // 监听的端口号
//编译器
const compiler = Webpack(webpackConfig);
//  devServer 参数
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
    // open: true, // 自动打开浏览器
    compress: true,// gzip 压缩
    stats: "minimal",
});
const server = new WebpackDevServer(compiler, devServerOptions);
webpackHotMiddleware(compiler)
server.listen(port, host, async (err,data) => {
    console.log(data);
    console.log(err,'err');
    if (err) {
        return logger.error(err.message);
    }
    logger.appStarted(port, 'localhost');
});

