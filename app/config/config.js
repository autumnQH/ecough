const config = {
    wx: {
//正式
      appid: 'wxff24c10734aed1ef',
      appSecret: 'e4f2067a90f7aed463e6bc51ba02f51d',
//测试
//      appid: 'wxc25f48089fba29f3',
//      appSecret: '328f39d113a5e31d58b0fb20cdccb4c7',
      token: 'ecough',
      mchid: '1470073502',
      key: 'qwertyuiopasdfghjklzxcvbnm123456'
      ,encodingAESKey: '9dq7tO5Gi7iP6tIiCUBUXM55eVG8CGCWuRS2zyk5CPS'
      ,message: {
        text: "终于等到您，还好没放弃！",
        default: "冥冥之中自有缘分！" 
      }
    },
    db: {
      host: 'localhost',
      //port:  '3306',
      name: 'ecough',
      user: 'root',
      passwd: 'root',
//      passwd: '450450', 
      conn_limit: 5
    },
    server: {
      host: 'www.e-cough.com',
//      host: '127.0.0.1',
      port: 80
    },
    app: {
      name: "ecough",
      version: "1.0",
    },
}

module.exports = Object.assign({}, config);
