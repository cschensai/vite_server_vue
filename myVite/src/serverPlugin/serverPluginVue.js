// 解析.vue源文件
const path = require('path');
const fs = require('fs').promises;



function serverPluginVue({ app, root }) {
  app.use(async (ctx, next) => {
    const { path: reqPath, query } = ctx.request;

    // reqPath: /src/app.vue
    if (reqPath.endsWith('.vue')) {
      // 找到请求文件在项目中的路径
      const filePath = path.join(root, '../', reqPath);

      const originContent = await fs.readFile(filePath, 'utf-8');


      // 解析template和script
      const compilerSfcPath = path.resolve(root, '../', 'node_modules', '@vue/compiler-sfc/dist/compiler-sfc.cjs');

      // 两个核心方法：compilerTemplate解析模版  parse解析script
      const { compileTemplate, parse } = require(compilerSfcPath);

      const { descriptor } = parse(originContent);
      const { script: { content: scriptContent }, template: { content: templateContent } } = descriptor;

      // 只用来标识开始解析template模板
      let code  = '';
      if (query.type === 'template') {
        const res = compileTemplate({ source: templateContent });
        code = res.code;
      } else {
        // 解析script
        // url上没有type查询参数
       
        // 拼接代码
        if (scriptContent) {
          code = scriptContent.replace('export default ', 'const __script = ');
        }

        // 开始解析template模板
        if (templateContent) {
          code += `import {render as __render} from "${reqPath}?type=template";\n__script.render = __render;\nexport default __script;`
        }
      }
      ctx.type = 'application/javascript';
      ctx.body = code;
    } else {
      await next();
    }
  })
}

module.exports = serverPluginVue;