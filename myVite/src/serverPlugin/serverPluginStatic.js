// 静态文件处理,找html,先去加载静态文件html


const static = require('koa-static');
const path = require('path');

function serverPluginStatic({ app, root }) {
  const filePath = path.resolve(root, '../');
  // 找到html所处的目录，filePath： 这里是根据process.cwd()执行目录决定的
  app.use(static(filePath))
}
module.exports = serverPluginStatic;