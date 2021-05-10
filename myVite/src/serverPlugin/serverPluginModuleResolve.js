// 对模块重写后的路径进行解析
const path = require('path');
const fs = require('fs').promises;


function serverPluginModuleResolve({ app, root }) {
  // 如果是以/@modules自定义标识开头的，就要去解析

  app.use(async (ctx, next) => {
    const regExp = /^\/@modules\//;
    const { path: reqPath } = ctx.request;
    if (regExp.test(reqPath)) {
      // vue: package name

      const resolveId = reqPath.replace(regExp, '');

      // 统一维护packgae 映射表
      const mapImports = {
        vue: path.resolve(root, '../', 'node_modules', '@vue/runtime-dom/dist/runtime-dom.esm-browser.js'),
      }
      const content = await fs.readFile(mapImports[resolveId], 'utf-8');
      ctx.type = 'application/javascript';
      ctx.body = content;

    } else {
      // 相对路径继续执行
      await next();
    }
  })
}

module.exports = serverPluginModuleResolve;