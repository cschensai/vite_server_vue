const stream = require('stream');

// 读取文件流
function readStreamBody(streamBody) {
  return new Promise((resolve) => {
    // 判断是否是文件流
    if (streamBody instanceof stream.Readable) {
      let data = '';
      streamBody.on('data', chunk => {
        data += chunk;
      })
      streamBody.on('end', () => {
        resolve(data);
      })
    } else {
      // 原封不动的返回
      resolve(streamBody);
    }
  })
}

module.exports = {
  readStreamBody,
}