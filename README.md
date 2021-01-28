##  babel-cli 打包babel6 
**babel7是@babel/cli**
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
####  执行顺序
- Plugin 会运行在 Preset 之前。
- Plugin 会从前到后顺序执行。
- Preset 的顺序则 刚好相反(从后向前)

#### 安装webpack，打包的文件可以在浏览器运行
```
yarn add webpack webpack-cli babel-loader -D
```
>webpack 有 loader 的概念，因此就出现了 babel-loader 和 babel-cli 一样也会读取 .babelrc 或者 package.json 中的 babel 段作为自己的配置，之后的内核处理也是相同。唯一比 babel-cli 复杂的是，它需要和 webpack 交互，因此需要在 webpack 这边进行配置。比较常见的如下：
```
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }
  ]
}
```
如果想在这里传入 babel 的配置项，也可以把改成：
```
// loader: 'babel-loader' 改成如下：
use: {
  loader: 'babel-loader',
  options: {
    // 配置项在这里
  }
}
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

#### 避免编译后的代码中出现重复的帮助程序，有效减少包体积 ,@babel/plugin-transform-runtime 是一个可以重复使用 Babel 注入的帮助程序，以节省代码大小的插件。@babel/plugin-transform-runtime 需要和 @babel/runtime 配合使用
```
yarn add @babel/plugin-transform-runtime  @babel/runtime -D
```
```
src/index.js
```
import bbb from './other'
let arrow = () => {
    console.log('arrow')
}
let arr = [1, 2, 3]
arr.includes(3)
bbb()
class App {

}
```
src/other.js
```
class other{

}
```
编译后的代码，_classCallCheck 这个方法定义了两次。一个 js 文件就定义一次。那项目中有很多文件，岂不是定义很多次。

# Babel7 和 Babel6区别
#### preset 的变更
> 淘汰 es201x，删除 stage-x，强推 env (重点).凡是使用 es201x 的开发者，都应当使用 env 进行替换

为了减少开发者替换配置文件的机械工作，babel 开发了一款 babel-upgrade 的工具，它会检测 babel 配置中的 stage-x 并且替换成对应的 plugins。除此之外它还有其他功能，我们一会儿再详细看。(总之目的就是让你更加平滑地迁移到 babel 7)

#### npm package 名称的变化

这是 babel 7 的一个重大变化，把所有 babel-* 重命名为 @babel/*，例如：

babel-cli 变成了 @babel/cli。
babel-preset-env 变成了 @babel/preset-env。进一步，还可以省略 preset 而简写为 @babel/env。
babel-plugin-transform-arrow-functions 变成了 @babel/plugin-transform-arrow-functions。和 preset 一样，plugin 也可以省略，于是简写为 @babel/transform-arrow-functions。
这个变化不单单应用于 package.json 的依赖中，包括 .babelrc 的配置 (plugins, presets) 也要这么写，为了保持一致。例如
```
{
  "presets": [
-   "env"
+   "@babel/preset-env"
  ]
}
```
顺带提一句，上面提过的 babel 解析语法的内核 babylon 现在重命名为 @babel/parser，看起来是被收编了。

上文提过的 stage-x 被删除了，它包含的插件虽然保留，但也被重命名了。babel 团队希望更明显地区分已经位于规范中的插件 (如 es2015 的 babel-plugin-transform-arrow-functions) 和仅仅位于草案中的插件 (如 stage-0 的 @babel/plugin-proposal-function-bind)。方式就是在名字中增加 proposal，所有包含在 stage-x 的转译插件都使用了这个前缀，语法插件不在其列。

最后，如果插件名称中包含了规范名称 (-es2015-, -es3- 之类的)，一律删除。例如 babel-plugin-transform-es2015-classes 变成了 @babel/plugin-transform-classes。(这个插件我自己没有单独用过，惭愧)

#### 不再支持低版本 node
babel 7.0 开始不再支持 nodejs 0.10, 0.12, 4, 5 这四个版本，相当于要求 nodejs >= 6 (当前 nodejs LTS 是 8，要求也不算太过分吧)。

这里的不再支持，指的是在这些低版本 node 环境中不能使用 babel 转译代码，但 babel 转译后的代码依然能在这些环境上运行，这点不要混淆。
only 和 ignore 匹配规则的变化
在 babel 6 时，ignore 选项如果包含 *.foo.js，实际上的含义 (转化为 glob) 是 ./**/*.foo.js，也就是当前目录 包括子目录 的所有 foo.js 结尾的文件。这可能和开发者常规的认识有悖。

于是在 babel 7，相同的表达式 *.foo.js 只作用于当前目录，不作用于子目录。如果依然想作用于子目录的，就要按照 glob 的完整规范书写为 ./**/*.foo.js 才可以。only 也是相同。

这个规则变化只作用于通配符，不作用于路径。所以 node_modules 依然包含所有它的子目录，而不单单只有一层。(否则全世界开发者都要爆炸)

@babel/node 从 @babel/cli 中独立了
和 babel 6 不同，如果要使用 @babel/node，就必须单独安装，并添加到依赖中。

babel-upgrade
在提到删除 stage-x 时候提过这个工具，它的目的是帮助用户自动化地从 babel 6 升级到 7。

这款升级工具的功能包括：(这里并不列出完整列表，只列出比较重要和常用的内容)

package.json
把依赖(和开发依赖)中所有的 babel-* 替换为 @babel/*
把这些 @babel/* 依赖的版本更新为最新版 (例如 ^7.0.0)
如果 scripts 中有使用 babel-node，自动添加 @babel/node 为开发依赖
如果有 babel 配置项，检查其中的 plugins 和 presets，把短名 (env) 替换为完整的名字 (@babel/preset-env)
.babelrc
检查其中的 plugins 和 presets，把短名 (env) 替换为完整的名字 (@babel/preset-env)
检查是否包含 preset-stage-x，如有替换为对应的插件并添加到 plugins
使用方式如下：

# 不安装到本地而是直接运行命令，npm 的新功能
npx babel-upgrade --write

# 或者常规方式
npm i babel-upgrade -g
babel-upgrade --write
babel-upgrade 工具本身也还在开发中，还列出了许多 TODO 没有完成，因此之后的功能可能会更加丰富，例如上面提过的 ignore 的通配符转化等等。