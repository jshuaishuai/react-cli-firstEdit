/*
 * @Descripttion: 
 * @Author: Jason
 * @LastEditTime: 2021-03-13 11:34:33
 */

module.exports = require('./webpack.common')({
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [],
    stats: 'normal',//只在发生错误或有新的编译时输出
})