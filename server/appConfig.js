/*
 * @Descripttion: 代理到后端服务器
 * @Author: Jason
 * @LastEditTime: 2021-03-15 16:33:30
 */

module.exports = {
    deployUrl: '127.0.0.0:8080', // 本地代码推推送到指定服务器
    proxyUrlMap: {
        '/api': 'localtion:3000', // 代理的接口关键字
        '/api2': 'localtion:4000', // 代理的接口关键字
    },
    port: 9001, // 端口号,
    host: '0.0.0.0', // ip 和 localhost 都能访问
};
