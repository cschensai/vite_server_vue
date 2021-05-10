

## Vite

### 什么是Vite？

> Vite是一个由原生ESM驱动的Web开发构建工具，在开发环境下是借助现代浏览器对ES import特性的支持，在生产环境下是基于Rollup的打包。

### 背景

> Vite，号称是下一代前端开发和构建工具
>
> Vite的出现得益于浏览器对module的支持，利用浏览器的新特性去实现了极速的开发体验,能够极快的实现热重载(HMR)
>
> 开发模式下，利用浏览器的module支持，达到了极致的开发体验
>
> 正式环境的编译打包，使用了首次提出tree-shaking的rollup进行构建

### 构建流程

#### 基于打包器的开发服务器

![image-20210423100756905](/Users/chensai/Library/Application Support/typora-user-images/image-20210423100756905.png)

#### 基于 ESM 的开发服务器

![image-20210423104433302](/Users/chensai/Library/Application Support/typora-user-images/image-20210423104433302.png)

### ES 模块对浏览器的支持

```javascript
// 在浏览器端使用 export、import 的方式导入和导出模块，在 script 标签里设置 type="module"

// 浏览器会识别添加 type="module"的 <script> 元素，浏览器会把这段内联 script 或者外链 script 认为是 ECMAScript 模块，浏览器将对其内部的 import 引用发起 http 请求获取模块内容。
```

![img](https://segmentfault.com/img/remote/1460000023016728)

### Vite怎样的特点？

- 快速冷启动
- 公用包预构建，借助max-age浏览器强缓存特性
- 基于缓存的即时模块热更新
- 按需编译
- 开发模式下不打包，原封不动的返回文件
- 生产环境下基于rollup打包，继承rollup大部分api接口和插件（这是因为rollup打包支持ESM格式，并且可以一次输出多种格ESM/CJS等）

### Webpack怎样的特点

- webpack 之类的打包工具为了在浏览器里加载各模块，会合并组装各模块，比如 webpack 使用 map 存放模块 id 和路径，使用 **webpack_require** 方法获取模块导出，vite 利用浏览器原生支持模块化导入这一特性，省略了对模块的组装，也就不需要生成 bundle，所以 **冷启动是非常快的**
- 打包工具会将各模块提前打包进 bundle 里，但打包的过程是静态的——不管某个模块的代码是否执行到，这个模块都要打包到 bundle 里，这样的缺点就是随着项目越来越大打包后的 bundle 也越来越大。而 **ESM 天生对import就是按需加载**

### 在构建方面有什么区别？

- 开发模式下
  - 编译阶段
    - webpck先全量编译打包进内存，再交由server启动
    - 直接按需编译，**不打包**，基于esm
  - 运行时阶段
    - webpack所有路径都可以加载
    - Vite只能加载相对路径
- 生产模式下
  - webpack打包
  - 基于rollup打包

### Vite做了什么？

vite提供了很多的配置选项，包括vite本身的配置，esbuild的配置，rollup的配置等等，今天带领大家从源码的角度看看vite。

vite其实是可以分为三部分的

- 一部分是开发过程中的client部分；
  - websocket 处理HMR
- 一部分是开发过程中的server部分；
- 另外一部分就是与生产有关系的打包编译部分，由于vite打包编译其实是用的rollup

针对Vue/Jsx做了什么？

- 1.基于koa2开发服务器读取静态资源index.html
- 2.基于浏览器无法读取第三方包并安装，只能先去替换一个别名，然后基于当前线程执行路径寻址node_modules下的依赖包
- 3.找到第三方包去替换为node_modules下的路径
- 解析Vue/Jsx的内容设置reponse header content-type为application/javascript，编译为js代码，让浏览器执行



![image-20210429151423114](/Users/chensai/Library/Application Support/typora-user-images/image-20210429151423114.png)





