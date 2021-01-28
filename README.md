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
@babel/preset-env
```