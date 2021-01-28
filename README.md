## @babel/cli 打包babel6 
**babel7是babel-cli**
#### 安装
```
yarn add @babel/cli @babel/core -D 
```
#### 执行，打包后的es6语法没有转化

>babel是一个编译器（输入源码 => 输出编译后的代码）。就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。

```
"build": "babel src/index.js --out-file dist/index.js"
```
#### 插件才是编译代码的核心

>babel如果没有插件没有办法编译出转化出支持各个浏览器的代码

**babel开发者为配置文件提供了多种形式, babel7官方推荐用babel.config.js的形式。也可以用.babelrc, .babelrc.js 或者放到package.json中**

##### 插件单个引入
```
@babel/plugin-transform-arrow-functions 转化箭头函数
"plugins":[
        "@babel/plugin-transform-arrow-functions"
    ],
```

#### 预设preset（插件包）

>babel会预先替我们做好了一系列的插件包

```
@babel/preset-env 转化基本语法
```
#### @babel/polyfill

>es6新增的方法在低版本的游览器无法使用, Babel 所做的只是帮你把ES6 模块化语法转化为CommonJS 模块化语法，其中的 require exports 等是 CommonJS 在具体实现中所提供的变量。

>任何实现 CommonJS 规范的环境（如 node 环境）可以直接运行这样的代码，而浏览器环境并没有实现对 CommonJS 规范的支持，所以我们需要使用打包工具（bundler）来进行打包，说的直观一点就是把所有的模块组装起来，为我们的代码做一些包裹，让它能在浏览器端使用。形成一个常规的 js 文件。打包工具有 比如 Browserify, Webpack 等

src/index
```
import '@babel/polyfill'; // 这就是@babel/polyfill的用法

let arrow = () => {
    console.log('arrow')
}
let arr = [1, 2, 3]
arr.includes(3)
```
打包到dist下，require浏览器运行不起来，只能node使用
```
"use strict";
require("@babel/polyfill");
var func = function func() {};
var arr = [1, 2, 4];
arr.includes(3);
```
#### 安装webpack，打包的文件可以在浏览器运行

```
yarn add webpack webpack-cli babel-loader -D
```
webpack打包后发现
 - 不压缩代码要261 KiB 
 - 压缩代码也只是87.49 KiB
 - 而原始的直接babel编译只要178 bytes

### 优化 (按需加载)
> 设置 .babelrc 增加useBuiltIns,useBuiltIns为usage时候必须设置corejs,@babel/polyfill默认会安装 "corejs": 2

>core-js@2 中不支持新的特性了例如Array.prototype.flat()

>core-js@3支持很多新特性
```
yarn add core-js@3 -D
yarn remove @babel/polyfill
```
```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": [
                        "> 1%",
                        "last 2 versions"
                    ]
                },
                "useBuiltIns": "usage",
                "corejs": 3//默认是2
            }
        ]
    ]
}

