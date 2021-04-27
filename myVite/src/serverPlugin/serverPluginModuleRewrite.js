// 重写模块路径

const { readStreamBody } = require("../utils");
// 梅西字符串，识别import的位置，具体到哪一行，哪一列
const { parse } = require('es-module-lexer');

// 将字符串改为引用类型，因为字符串具有不可变性，而且使用正则很弱，所以这里用magic-string代替正则的作用
const MagicString = require('magic-string');


// 重写第三方模块路径
function rewriteImports(source) {
  // 将source字符串转换为引用类型（对象）
  const ms = new MagicString(source)


  // 解析source，找出所有import xxx 的语法位置，是个二维数组
  const imports = parse(source);
  const importPositionArr = imports[0];


  // 有import xxx的语法 n: resolveId, s: 开始位置 e: 结束位置
  importPositionArr.forEach(({ n, s, e }) => {
    // resolveId：标识
    let resolveId = n;
    // 只处理第三方的包 ,排除以/或者.开头的resolveId
    const regExp = /^[\.\/]/;
    if (regExp.test(resolveId)) return; // 相对路径什么都不做
    resolveId = `/@modules/${resolveId}`;
    ms.overwrite(s, e, resolveId);
  });
  
  // 返回替换后的内容
  return ms.toString();
}



// 插件
function serverPluginModuleRewrite({ app, root }) {
  app.use(async (ctx, next) => {

    // 默认会先执行静态文件的中间件，。然后将结果然后到这个中间件中（ctx.body: 文件流）
    await next();
    // 需要将文件流转换为字符串,只处理js
    if (ctx.body && ctx.response.is('js')) {
      // 读流，返回字符串
      const streamStr = await readStreamBody(ctx.body);

      // 重写第三方模块路径  ---》 /node_modules/.vite/vue.js
      const sourceAfterRewriteImports = rewriteImports(streamStr);
      ctx.type = 'application/javascript';
      ctx.body = sourceAfterRewriteImports;

    }
  })
}

module.exports = serverPluginModuleRewrite;