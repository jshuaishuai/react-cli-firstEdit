-   @Descripttion:
<!--
-   @Author: Jason

*   @LastEditTime: 2021-03-21 20:39:52
    -->

### Webpack5 搭建 react 脚手架

> `Webpack 5` 对 Node.js 的版本要求至少是 10.13.0 (LTS)

#### 项目初始化

```bash
mkdir webpack5-demo
cd webpack5-demo
npm init -y
```

#### 安装基础的依赖文件

刚刚开始需要安转的包，我直接贴出来吧，可以复制到 package.json 文件上 执行 `npm i 或 yarn`

**package.json**

```json
"devDependencies": {
    "@babel/core": "^7.13.8",
    "@babel/preset-env": "^7.13.8",
    "@babel/preset-react": "^7.12.13",
    "babel-loader": "^8.2.2",
    "chalk": "^4.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^5.1.0",
    "html-webpack-plugin": "^5.2.0",
    "ip": "^1.1.5",
    "style-loader": "^2.0.0",
    "progress-bar-webpack-plugin": "^2.1.0",
    "speed-measure-webpack-plugin": "^1.4.2",
    "webpack": "^5.24.2",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  },
  "dependencies": {
    "react": "^17.0.1",
    "react-dom": "^17.0.1"
  }
```

**此时文件目录情况**

```js
webpack5-demo
├─ node_modules
├─ package-lock.json
└─ package.json
```

#### 配置 webpack

为了区分开发生产环境，方便维护，就不把所有内容配置到 `webpack.config.js` 这一个文件里面了。

```bash
# 这里我们新建一个 config 目录用来专门存放 webpack 配置文件
mkdir config
cd config
touch webpack.common.js # 开发环境 和 生产环境 公共配置 存放在这个文件里面
touch webpack.dev.js # 需要针对开发环境特殊处理的配置存放在这里
touch webpack.prod.js # 需要针对生产环境特殊处理的配置存放在这里
```

在配置 Webpack 的时候少不了会与 文件路径打交道，避免路径零乱，单独创建一个路径调用的配置文件，也是参考 CRA 的

```
touch paths.js
```

**paths.js**

```js
const path = require("path");
const fs = require("fs");
// 获取当前工作目录
const appDirectory = fs.realpathSync(process.cwd());
// 从相对路径中解析绝对路径
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
// 默认的模块扩展名
const moduleFileExtensions = ["js", "jsx", "ts", "tsx", "json"];
// 解析模块路径
const resolveModule = (resolveFn, filePath) => {
    // 查看文件存不存在
    const extension = moduleFileExtensions.find((extension) =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );
    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }
    return resolveFn(`${filePath}.js`); // 如果没有默认就是js
};

module.exports = {
    appBuild: resolveApp("build"), // 打包路径
    appPublic: resolveApp("public"), // 静态资源路径
    appHtml: resolveApp("public/index.html"), // html 模板路径
    appIndexJs: resolveModule(resolveApp, "src/index"), // 打包入口路径
    appNodeModules: resolveApp("node_modules"), // node_modules 路径
    appSrc: resolveApp("src"), // 主文件入口路径
    moduleFileExtensions, // 模块扩展名
};
```

**此时文件目录情况**

```js
demo
├─ config
├─ paths.js
│  ├─ webpack.common.js
│  ├─ webpack.dev.js
│  └─ webpack.prod.js
├─ node_modules
├─ package-lock.json
└─ package.json
```

**webpack.common.js**

```js
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = function (options) {
    return {
        mode: options.mode,
        entry: paths.appSrc,
        output: {
            path: paths.appBuild,
            publicPath: "/",
        },
        cache: {
            // 使用持久化缓存
            type: "filesystem", //memory:使用内容缓存 filesystem：使用文件缓存
        },
        devtool: false,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    "@babel/preset-env",
                                    "@babel/preset-react",
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        devServer: {},
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
            }),
            ...options.plugins,
        ],
        stats: options.stats, // 打包日志发生错误和新的编译时输出
    };
};
```

entry 是 入口，这里我们需要新建一个入口文件

```bash
# 回到webpack5-demo 根目录
# 创建一个src 目录开发文件

mkdir src
touch index.js # 创建一个入口文件
```

```js
import React from "react";
import ReactDOM from "react-dom";

const App = () => {
    return <div> App入口 </div>;
};

ReactDOM.render(<App />, document.querySelector("#root"));
```

在打包的时候，使用了`HtmlWebpackPlugin`,所以得去创建一个 html 模板提供足够插件使用

```bash
# 回到webpack5-demo 根目录
# 创建一个public 目录专门存放 静态资源

mkdir public
touch index.html # 创建一个html 模板
```

**index.html**

```js
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Webpack-React-Cli</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

**webpack.dev.js**

```js
module.exports = require("./webpack.common")({
    mode: "development",
    plugins: [],
    stats: "errors-only", //只在发生错误或有新的编译时输出
});
```

**webpack.prod.js**

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //打包前清空build目录文件
const ProgressBarPlugin = require("progress-bar-webpack-plugin"); // 打包进度条美化
const chalk = require("chalk");

module.exports = require("./webpack.common")({
    mode: "production",
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new ProgressBarPlugin({
            format:
                `${chalk.green.bold("build[:bar]")} ` +
                chalk.green.bold(":percent") +
                " (:elapsed seconds)",
            clear: false,
            width: 60,
        }),
    ],
    stats: "normal", //标准输出
});
```

**此时文件目录情况**

```js
webpack5-demo
├─ config
│  ├─ paths.js
│  ├─ webpack.common.js
│  ├─ webpack.dev.js
│  └─ webpack.prod.js
├─ node_modules
├─ public
│  └─ index.html
├─ src
│  └─ index.js
├─ package-lock.json
└─ package.json
```

#### 启动服务

现在我们的 webpack 基础配置已经 OK 了，就差启动了

配置 pageage.json 脚本

```js
{
  "name": "webpack5-demo",
  "version": "1.0.0",
  "description": "基于webpack5 的React架手架",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config config/webpack.prod.js",
    "start": "webpack serve --config config/webpack.dev.js", // v5
    "dev": "webpack-dev-server --config config/webpack.dev.js" //v4
  },
  "keywords": [],
  "author": "Jason",
  "license": "ISC",
  ...
}
```

这里有点小改动：

在 `Webpack 4` 里面通过 `webpack-dev-server`起服务
在 `Webpack 5` 里面启动服务里通过 `webpack serve`

![](./public/assets/imgs/info-1.png)

现在已经成功启动了，但是这个启动日志不是很喜欢，我得改造一下（实现自定义输出编译内容），需要重新配置一下开发服务器（webpack-dev-server）

#### 配置开发服务器

虽然建议通过 CLI 运行 webpack-dev-server，但我们也可以选择通过 API 启动服务器。

```bash
# 回到webpack5-demo 根目录
# 创建一个server目录

mkdir server
touch index.js # 服务入口
touch appConfig.js # 基础服务配置 自定义服务端口，ip, 代理地址
touch logger.js # 控制台输出的日志
```

**appConfig.js**

```js
module.exports = {
    deployUrl: "127.0.0.0:8080", // 本地代码推推送到指定服务器
    proxyUrlMap: {
        "/api": "localtion:3000", // 代理的接口
        "/api2": "localtion:4000", // 代理的接口
    },
    port: 9000, //端口号,
    host: "localhost", //主机号
};
```

**logger.js**

```js
const ip = require("ip");

const divider = chalk.gray("\n-----------------------------------");

const logger = {
    error: (err) => {
        console.error(chalk.red(err));
    },
    appStarted: (port, host, tunnelStarted) => {
        console.log(`Server started ! ${chalk.green("✓")}`);

        if (tunnelStarted) {
            console.log(`Tunnel initialised ${chalk.green("✓")}`);
        }
        console.log(`
${chalk.bold("Access URLs:")}${divider}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
LAN: ${
            chalk.magenta(`http://${ip.address()}:${port}`) +
            (tunnelStarted
                ? `\n    Proxy: ${chalk.magenta(tunnelStarted)}`
                : "")
        }${divider}
${chalk.blue(`Press ${chalk.italic("CTRL-C")} to stop`)}
    `);
    },
};

module.exports = logger;
```

**index.js**

```js
const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
// webpack开发 配置文件
const webpackConfig = require("../config/webpack.dev");
// 自定义日志输出
const logger = require("./logger");
// 服务配置
const appConfig = require("./appConfig");

const { port, host } = appConfig; // 监听的端口号
//编译器
const compiler = Webpack(webpackConfig);
//  devServer 参数
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
    // open: true, // 自动打开浏览器
    compress: true, // gzip 压缩
    stats: "minimal",
});
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(port, host, async (err) => {
    if (err) {
        return logger.error(err.message);
    }
    logger.appStarted(port, "localhost");
});
```

在`package.json` 配置启动命令

```js
"scripts": {
    "build": "webpack --config config/webpack.prod.js",
    "start": "node server"
  },
```

![](./public/assets/imgs/info-2.png)

**此时文件目录情况**

```js
webpack5-demo
├─ config
│  ├─ paths.js
│  ├─ webpack.common.js
│  ├─ webpack.dev.js
│  └─ webpack.prod.js
├─ node_modules
├─ public
│  └─ index.html
├─ server
│  ├─ appConfig.js
│  ├─ index.js
│  └─ logger.js
├─ src
│  └─ index.js
├─ package-lock.json
└─ package.json
```

#### resolve 解析

`resolve` 配置以下这几个就可以了，其他使用默认就行

-   modules: 使用第三模块 第一反应去 根目录下的 node_modules 寻找
-   extensions : 在 `import` 的时候不加文件扩展名,会依次遍历`extensions` 添加扩展名进行匹配
-   alias: 创建别名， 在`import` 或 `require` 的别名，来确保模块引入变得更简单

```js
 resolve: {
    modules: [paths.appNodeModules],
    extensions: ['.js', '.jsx', '.css'],
    alias: {
        moment$: 'moment/moment.js',
        '@src': paths.appSrc,
        '@public': paths.appPublic,
    },
},
```

#### 基础 loader 配置

##### css 和 sass

**安装**

```bash
npm i -D style-loader css-loader
npm i -D node-sass sass-loader postcss postcss-loader postcss-preset-env
```

css 和 sass 的 loader 配置很简单
考虑到兼容性问题，还需要 postcss-loader 添加浏览器厂家标识头

用到的插件单独放在根目录的 `postcss.config.js` 配置文件里头

**postcss.config.js**

```js
module.exports = {
    plugins: {
        "postcss-preset-env": {},
    },
};
```

##### 模块资源

`Webpack 4` 在处理图片或文本类文件的时候用的都是 `file-loader` 或者 `url-loader`
现在对于 `Webpack 5` 来说可以用 `Asset Modules` (资源模块)，就不需要配置 loader 了

-   asset/source 导出资源的源代码 （相当于 raw-loader）
-   asset/resource 发送一个单独的文件并导出 URL（相当于 file-loader）
-   asset/inline 导出一个资源的 data URI（相当于 url-loader）
-   asset 在导出一个 data URI 和发送一个单独的文件之间自动选择，之前通过使用 url-loader，并且配置资源体积限制实现

```js
// 设置 常量
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const imageInlineSizeLimit = 4 * 1024;

module.exports = function (options) {

    return {

        ...

        module: {
            rules: [
                {
                    oneOf: [

                        ...

                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: ['style-loader', {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                                }
                            },'postcss-loader'],
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
    }

```

**测试一下 css 和图片**

```bash
# 在src 目录下新一个 style.scss 文件

touch style.scss
```

先写入点内容

```css
* {
    margin: 0;
    padding: 0;
}

div {
    color: red;
}
```

引入样式和图片

```js
import React from "react";
import ReactDOM from "react-dom";

import npm from "@public/assets/imgs/npm.png";

import "./style.scss";

const App = () => {
    return (
        <div>
            App入口
            <img src={npm} />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector("#root"));
```

![](./public/assets/imgs/npm-2.png)

**再看看打包情况**
![](./public/assets/imgs/build.png)

由于设置了持久化缓存，第二次速度就很快
**此时文件目录情况**

```js
webpack5-demo
├─ build
├─ config
│  ├─ paths.js
│  ├─ webpack.common.js
│  ├─ webpack.dev.js
│  └─ webpack.prod.js
├─ node_modules
├─ public
│  ├─ assets
│  │  └─ imgs
│  │     └─ npm.png
│  └─ index.html
├─ server
│  ├─ appConfig.js
│  ├─ index.js
│  └─ logger.js
├─ src
│  ├─ index.js
│  └─ style.css
├─ package-lock.json
└─ package.json
```

## 开发配置完善

### Babel 转译器和插件

首先先完善一下之前 `loader` 的配置

下面是原先的 处理`js、jsx `的 `loader`配置

```js
{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
        {
            loader: "babel-loader",
            options: {
                presets: [
                    "@babel/preset-env",
                    "@babel/preset-react",
                ],
            },
        },
    ],
},
```

#### Babel presets 配置

babel 应该有知道吧 `是一个 JavaScript 编译器` 官方的定义，它的作用的是让低版本浏览器使用 ES 上新的语法和新的数据类型, 将高版本的 ES 语法和 API 转换成现有浏览器可以运行的代码, 起转译作用。

```js
babel-loader @babel/core @babel/preset-env
```

这个三个算的上 babel 在 webpack 中的必不可少的存在

##### babel-loader

这个包允许使用 Babel 和 webpack 编译 JavaScript 文件 [babel-loader](https://github.com/babel/babel-loader/blob/master/README.md)

##### @babel/core

它是 babel 核心库，提供了很多转译 源文件的 API，它需要插件 才能转译，本身不会转译，

```js
import { transformSync } from "@babel/core";

function babelLoader(source, options) {
    //  var options= {
    //             presets: [
    //                 "@babel/preset-env",
    //                 "@babel/preset-react",
    //             ],
    //         },
    var result = transformSync(source, options);
    return this.callback(null, result.code, result.map, result.ast);
}
module.exports = babelLoader;
```

-   source 需要的转译源文件或者是上一个 loader 转译过的结果
-   options 就是配置 loader 中传的 options 参数
-   transformSync 同步转译传入的代码，返回转转译后代码、sourceMap 映射和 AST 对象。

##### @babel/preset-env

`babel/preset-env` 是语法转译器也可以叫预设，但是它只转换新的 ES 语法，而不转换新的 ES API，比如 Iterator, Generator, Set, Maps, Proxy, Reflect,Symbol,Promise，而对与这些 新的 API 可以通过 babel-profill 转译，让浏览器实现 新 API 的功能 但是 [babek-profill](https://github.com/babel/babel/tree/master/packages/babel-polyfill) 已经不建议使用了,建议使用 core-js

> As of Babel 7.4.0, this package has been deprecated in favor of directly including core-js/stable (to polyfill ECMAScript features) and regenerator-runtime/runtime (needed to use transpiled generator functions):

```js
npm i core-js -S
```

配置如下

```js
{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: [['@babel/preset-env', {
                    useBuiltIns: 'entry',
                    corejs: '3.9.1',
                    targets: {
                        chrome: '60',
                    },
                }], '@babel/preset-react'],
            },
        },
    ],
},
```

##### @babel/preset-env 参数

-   useBuiltIns: "usage"| "entry"| false，默认为 false, 这里讲一讲 `usage` 其他参数的具体看官方描述[传送门](https://www.babeljs.cn/docs/babel-preset-env)

-   usage 会根据配置的浏览器兼容，和只对你用到的 API 来进行 polyfill，实现按需添加补丁

-   targets：

```js
// 对市场份额 >0.25% 做兼容
{
  "targets": "> 0.25%, not dead"
}
// 对要支持的最低环境版本的对象 做兼容
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

当未指定目标时，它的行为类似：preset-env 将所有 ES2015-ES2020 代码转换为与 ES5 兼容。不建议直接使用以下 preset-env 这种方式，因为它没有利用针对特定环境/版本的功能

```js
{
  "presets": ["@babel/preset-env"]
}
```

由于自@babel/polyfill7.4.0 起已弃用，因此建议您 core-js 通过该 corejs 选项直接添加和设置版本

-   corejs: '3.9.1' 这个'3.9.1' 是 core-js 版本号

#### @babel/preset-react

React 插件的 Babel 预设, `JSX` 转 `React.createElement()`来调用的，主要在转译 react 代码的时候使用。

-   这是一段 jsx 代码

```js
<div className="wrap" style={{ color: "#272822" }}>
    <span>一起学习</span>React
</div>
```

-   经过 babel/preset-react 转移器转译成：

```js
React.createElement(
    "div",
    {
        className: "wrap",
        style: {
            color: "#272822",
        },
    },
    React.createElement("span", null, "一起学习"),
    "React"
);
```

#### babel plugin 配置

@babel/plugin-syntax-dynamic-import 支持动态加载 import,@babel/preset-env 不支持动态 import 语法转译。

> Currently, @babel/preset-env is unaware that using import() with Webpack relies on Promise internally. Environments which do not have builtin support for Promise, like Internet Explorer, will require both the promise and iterator polyfills be added manually.

@babel/plugin-proposal-decorators 把类和对象的装饰器编译成 ES5 代码
@babel/plugin-proposal-class-properties 转换静态类属性以及使用属性初始值化语法声明的属性

> 配置转译所需要的插件。使用插件的顺序是按照插件在数组中的顺序依次调用的

现在 babel-loader 参数比较臃肿可以提到 .babelrc.js 文件中

```js
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "entry",
                corejs: "3.9.1",
                targets: {
                    chrome: "58",
                    ie: "11",
                },
            },
        ],
        [
            "@babel/preset-react",
            {
                development: process.env.NODE_ENV === "development",
            },
        ],
    ],
    plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        "@babel/plugin-syntax-dynamic-import",
    ],
};
```

### eslint 配置

目前 eslist 推荐使用 [eslint-webpack-plugin](https://webpack.js.org/plugins/eslint-webpack-plugin/)插件,因为 `eslint-loader` 即将废弃

> ⚠️ The loader eslint-loader will be deprecated soon

**安装**

```bash
npm i
eslint
eslint-webpack-plugin
eslint-config-airbnb-base
eslint-plugin-import -D
```

-   eslint >= 7 (版本)

-   eslint-config-airbnb-base 支持所有 es6+的语法规范,需要 eslint 和 eslint-plugin-import 一起使用

-   eslint-plugin-import 用于支持 eslint-config-airbnb-base 做导入/导出语法的检查

**webpack.dev.js**

```js
 new ESLintPlugin({
    fix: true, // 启用ESLint自动修复功能
    extensions: ['js', 'jsx'],
    context: paths.appSrc, // 文件根目录
    exclude: '/node_modules/',// 指定要排除的文件/目录
    cache: true, //缓存
}),
```

此外有了 ES 的语法规范 还需要 react jsx 的的语法规法，

```js
npm i eslint-plugin-react -D
// 在eslint config 拓展预设中 配置 react
extends: [
    "plugin:react/recommended", // jsx 规范支持
    "airbnb-base", // 包含所欲ES6+ 规范
],

// 或者 在插件中设置

"plugins": [
    "react"
  ]
```

同时在根目录配置 `.eslintrc.js`文件

**.eslintrc.js**

```js
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "airbnb-base", // 包含所欲ES6+ 规范
        "plugin:react/recommended", // react jsx 规范支持
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: [],
    rules: {
        "consistent-return": 0, // 箭头函数不强制return
        semi: 0,
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "react/jsx-uses-react": "error", // 防止react被错误地标记为未使用
        "react/jsx-uses-vars": "error",
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
        "react/jsx-key": 2, // 在数组或迭代器中验证JSX具有key属性
        "import/no-dynamic-require": 0,
        "import/no-extraneous-dependencies": 0,
        "import/no-named-as-default": 0,
        // 'import/no-unresolved': 2,
        "import/no-webpack-loader-syntax": 0,
        "import/prefer-default-export": 0,
        "arrow-body-style": [2, "as-needed"], // 箭头函数
        "class-methods-use-this": 0, // 强制类方法使用 this
        // 缩进Indent with 4 spaces
        indent: ["error", 4, { SwitchCase: 1 }], // SwitchCase冲突 闪烁问题
        // Indent JSX with 4 spaces
        "react/jsx-indent": ["error", 4],
        // Indent props with 4 spaces
        "react/jsx-indent-props": ["error", 4],
        "no-console": 0, // 不禁用console
        "react/jsx-props-no-spreading": 0,
        "import/no-unresolved": [
            2,
            {
                ignore: ["^@/"], // @ 是设置的路径别名
            },
        ],
    },
    //如果在webpack.config.js中配置了alias 并且在import时使用了别名需要安装eslint-import-resolver-webpack
    settings: {
        "import/resolve": {
            webpack: {
                config: "config/webpack.dev.js",
            },
        },
    },
};
/*
"off"或者0    //关闭规则关闭
"warn"或者1    //在打开的规则作为警告（不影响退出代码）
"error"或者2    //把规则作为一个错误（退出代码触发时为1）
*/
```

也可以把 eslint 配置 放在 package.json，跟下面这样但是内容有点多 为了减少耦合性还是放根目录吧
**package.json**

```json
"eslintConfig": {
    "extends": ["plugin:react/recommended","airbnb-base"],
    ...省略
}

```

#### 智能感知 import 别名（alias）

为了使用别名导入模块有更好的体验在根部目录添加一个 jsconfig.json 文件

**jsconfig.json**

```js

{
    "compilerOptions": {
        "baseUrl": "./src",// 基本目录，用于解析非相对模块名称
        "paths": {
            "@/*": ["./*"] //指定要相对于 baseUrl 选项计算别名的路径映射
        },
      "experimentalDecorators": true //为ES装饰器提案提供实验支持
    },
    "exclude": ["node_module"]
}

```

这个别名应该与 webpack resolve 中的别名一致

**webpack.common.js**

```js
resolve: {
    modules: [paths.appNodeModules],
    extensions: ['.js', '.jsx', '*'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
        moment$: 'moment/moment.js',
        '@/src': paths.appSrc,

    },
},
```

实际体验如何所示：

#### 环境配置完善

环境变量配置 可以分为 node 环境配置 和 模块环境配置，两者都是单独设置 无法共享

##### node 全局变量

通过 cross-env 可以设置 node 环境的全局变量区别`开发模式`还是`生产模式`

> ⚠️ 在 ESM 下无效的

```bash
npm i cross-env -D

```

**package.json**

```js
 "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config config/webpack.prod.js",
    "start": "cross-env NODE_ENV=development node server",
    ...省略
  },
```

**.eslintrc.js**

配置过 node 的环境全局变量后就可以 通过 `process.env.NODE_ENV` 获取到值

```js
 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 如果是生产环境就不允许debugger
```

##### DefinePlugin 用来设置模块内的全局变量

这个是 webpack 自带的一个插件，可以在任意`模块`内通过 process.env.NODE_ENV 获取到值

```js
 new webpack.DefinePlugin({
    NODE_ENV: isEnvProduction && JSON.stringify('production'), // 设置全局
}),
```

```js
const App = () => {
    console.log(process.env.NODE_ENV); // development

    return (
        <div>
            <Index />
            1133366
        </div>
    );
};
```

###### IgnorePlugin

-   IgnorePlugin 用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去

```js
new webpack.IgnorePlugin(/^\.\/locale/, /moment$/);
```

### 生产环境配置完善

#### 抽离 css

默认 打包是将 样式注入到 js 文件中运行性添加到 head style 标签，这样在开发模式下比较方便，但是生产环境建议将 css 抽离出来成为单独文件，这样如果应用代码发生变化,浏览器只能获取更改的 JS 文件，而提取的 css 文件则可以进行单独缓存.

安装

```bash
npm i -D mini-css-extract-plugin
```

-   该插件将 CSS 提取到单独的文件中。它为每个包含 CSS 的 JS 文件创建一个 CSS 文件，他为 style-loader 不能一起用，所以让它生产模式才生效。

-   将 loader 与 plugin 添加到的 webpack 配置文件中

**webpack.commom.js**

```js
const isEnvProduction = options.mode === 'production';

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

```

**webpack.prod.js**

```js

plugins: [
    ...省略
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css', //输出的 CSS 文件的名称
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',// 非入口的 css chunk 文件名称
        ignoreOrder: true, // 忽略有关顺序冲突的警告
    }),
],
```

#### 压缩 css

对 Webpack 5 [Optimize CSS Assets Webpack Plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 不推荐使用了，用 webpack 的 [css-minimizer-webpack-plugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root)

> ⚠️ For webpack v5 or above please use css-minimizer-webpack-plugin instead.

这个插件使用 cssnano 优化和压缩 CSS。就像 optimize-css-assets-webpack-plugin 一样，但在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行。

**安装**

```bash

npm install image-webpack-loader --save-dev
```

这将只在生产模式下启用 CSS 压缩优化，如果需要在开发模式下使用， 可以设置 optimization.minimize 选项为 true

**webpack.common.js**

```js
 optimization: {
    minimize: isEnvProduction, //是否是生产环境
    minimizer: [
        new CssMinimizerPlugin({
            parallel: true, // 开启多进程并发执行，默认 os.cpus().length - 1
        }),
        new TerserPlugin()
    ],
},
```

#### 压缩 js

terser-webpack-plugin 使用 [terser](https://github.com/terser/terser#minify-options) 适用于 ES6+ 的 JavaScript 解析器 来压缩 js 文件，是 Webpack 5 内置的 webpack4 是需要单独安装的

**webpack.common.js**

```js
const TerserPlugin = require('terser-webpack-plugin')
...
 optimization: {
    minimize: isEnvProduction,
    minimizer: [
        ...
        new TerserPlugin({
            parallel: true, // 开启多进程并发执行
        }),
    ],
},
```

#### 压缩图片

压缩图片也是平时打包优化的一重要环节

image-webpack-loader 可以帮助我们对图片进行压缩和优化,但是安装这这个遇到了一些坑，`Cannot find module 'gifsicle`,安装 gif 的时候报错了，image-minimizer-webpack-plugin 也一样

**安装**

```bash
npm i -D image-webpack-loader
```

image-webpack-loader 安装对应的[Issues](https://github.com/tcoopman/image-webpack-loader/issues/233)

> cnpm 是可以下载的但是 cnpm 相对 webpack 5 规则是不规范的下载工具 或者是 用 image-webpack-loader 低版本来试试，但是一版本会有一些 bug 我试了 yarn 和 npm 都遇到了`Cannot find module 'gifsicle'`

如果你成功使用了`image-webpack-loader`,可以使用一下配置

```js

 {
    test: /\.(gif|png|jpe?g|svg|webp)$/i,
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: imageInlineSizeLimit, // 4kb
        },
    },
    use: [
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65,
                },
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: '65-90',
                    speed: 4,
                },
                gifsicle: {
                    interlaced: false,
                },
                webp: {
                    quality: 75,
                },
            },
        },
    ],
},
```

-   mozjpeg —压缩 JPEG 图像

-   optipng —压缩 PNG 图像

-   pngquant —压缩 PNG 图像

-   svgo —压缩 SVG 图像

-   gifsicle —压缩 GIF 图像

##### image-minimizer-webpack-plugin

**安装**

```bash
npm install image-minimizer-webpack-plugin --save-dev
```

可以用两种模式优化图像：

-   无损（无质量损失）
-   有损（质量下降）

具体选择官方文档已经给出来了

imagemin 插件进行无损优化

```bash
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
```

imagemin 插件用于有损优化

```bash
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
```

`imagemin-gifsicle` 一样也是安装不了，

如果安装成功可以使用一下配置

**webpack.prod.js**

```js
new ImageMinimizerPlugin({
    minimizerOptions: {
        plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            [
                'svgo',
                {
                    plugins: [
                        {
                            removeViewBox: false,
                        },
                    ],
                },
            ],
        ],
    },
}),
```

### 优化思路

优化 方向分两个 一个是时间（速度）和空间（体积）
webpack 不管模块规范 打包出来统一都是 **webpack_require**, 如果开发模式可以支持 ESM 方案就好了好了速度就很快，这个只是个人痴想。

现在这种优化手段也比较多，或者也可以尝试 其他工具 Vite、Snowpack,但目前阶段还成熟，真的用到项目中的可能还比较少， 坑比较多，我也是几个页面在很小项目中使用了一下 Vite,但是工具本身这确实很 nice，期待其发展。
webpack 优化我就提提思路，然后很多博客都有提及，可以去看看他们的。

不管做什么都需要有明确的目标，优化也是如此，需要明白那里最耗时间，就从哪里入手，对症下药。
首先使用 speed-measure-webpack-plugin 可以分析打包各个步骤的时间

> 这个包在我这边使用不成功，在 issue 中也有一些人遇到了这个问题 [issue](https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/161)

```bash
npm i speed-measure-webpack-plugin -D
```

webpack-bundle-analyzer 分析打包出的文件包含哪些，大小占比如何，模块包含关系，依赖项，文件是否重复，压缩后大小如何

```bash
npm i webpack-bundle-analyzer -D
```

#### 编译时间优化

缩小文件查找范围

**resole**

```js
resolve: {
    modules: [paths.appNodeModules],
    extensions: ['.js', '.jsx', '*'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
        moment$: 'moment/moment.js',
        '@/src': paths.appSrc,
    },
},
```

**rule.oneOf**
在 loader 解析的时候对于 rules 中的所有规则都会遍历一遍，如果使用 oneOf 就可以解决该问题，只要能匹配一个即可退出,类似 Array.find 找到对的就返回不会继续找了

```js
module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          ...,
        ]
      }
    ]
  }
}
```

-   external

-   多进程处理

##### 缓存

-   持久化缓存
-   babel-loader 开启缓存

#### 体积优化

-   css html image js 压缩

-   tree-sharking
    在打包的时候去除没有用到的代码，webpack4 版本的 tree-shaking 比较简单,主要是找一个 import 进来的变量是否在这个模块内出现过，webpack5 可以进行根据作用域之间的关系来进行优化

    > tree-shaing 依赖 ESM，如果不是 ESM 就不支持，比如 commonjs 就不行，主要是 EMS 是静态依赖分析编译的时候就能判断出他的依赖项，而 require 是运行是加载，不不知道它是如何依赖的的就很蛋疼。

-   spliting-code

### 总结

具体细节可以[源码](https://github.com/jshuaishuai/react-cli-firstEdit)，然后上一次还有掘友遇到了，webpack-dev-server 起服务时遇到了问题，就是 页面报错后 重新修复了 页面不会刷新，我试了一下确实存在，这个具体原因我也没有找到，但是配置了 eslint 可以在它重新编译的时候恢复热更新，可以试下，然后这篇应该是 webpack 末篇了，后面可能会写一些比较有意思的 webpack 插件，然后在调试 webpack 的时候遇到问题可以在评论反馈，才疏学浅了 O(∩_∩)O 哈哈~，努力写好下一文吧，向前看。
