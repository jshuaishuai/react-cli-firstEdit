/*
 * @Descripttion: 代理到后端服务器
 * @Author: Jason
 * @LastEditTime: 2021-02-27 16:22:36
 */

module.exports = {
    deployUrl: '127.0.0.0:8080', // 本地代码推推送到指定服务器
    proxyUrlMap: {
        '/api': 'localtion:3000', // 代理的接口关键字
        '/api2': 'localtion:4000', // 代理的接口关键字
    },
    port: 9000, //端口号,
    host: 'localhost',//主机号
};
