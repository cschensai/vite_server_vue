const Koa = require('koa');
const serverPluginStatic = require('./serverPlugin/serverPluginStatic');
const serverPluginModuleRewrite = require('./serverPlugin/serverPluginModuleRewrite');
const serverPluginModuleResolve = require('./serverPlugin/serverPluginModuleResolve');
const serverPluginVue = require('./serverPlugin/serverPluginVue');


// 创建服务，基于koa
function createServer() {
  const app = new Koa();
  // 实现静态服务，访问服务器返回html内容 koa-static
  // app.use(ctx => {
  // })

  // 创建上下文，给中间件共享使用
  const context = {
    app,
    // 当前线程执行的目录文件(myVite命令执行所在的目录)
    root: process.cwd(),
  }

  // 中间件集合,每一个中间件都是一个函数，插件顺序很重要（洋葱模型原理）
  const resolvePlugin = [
    serverPluginModuleRewrite, // 4.重写module请求路径
    serverPluginModuleResolve, // 3. 读取重写路径之后的内容，响应给浏览器
    serverPluginVue, // 2.解析.vue源文件
    serverPluginStatic, // 1. 静态服务插件
  ];

  resolvePlugin.forEach(plugin => plugin(context))

  return app;
}

createServer().listen(4000, () => {
  console.log('server running at 4000');
})