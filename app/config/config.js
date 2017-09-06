var config = function () {
  const dao = require('../dao/wechat');
  var cfg =  dao.getConfig();
  console.log(cfg,'dao----config===');

var config = {
    wx: {
      appid: 'wxff24c10734aed1ef',appSecret: 'e4f2067a90f7aed463e6bc51ba02f51d',
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
      name: 'ecough',
      user: 'root',
      passwd: 'root', 
      conn_limit: 5
    },
    sms: {
      accessKeyId: 'LTAI8ttec2BYuOMC',
      secretAccessKey: '3sDGHGwyQWpNwCdSYoomAWFGj9wSUj',
      TemplateCode: 'SMS_91000028',
      SignName: '刘鹏'
    },
    server: {
      host: 'http://www.e-cough.com',
       port: 80
    },
    app: {
      name: "ecough",
      version: "1.0",
    },
};
  return config;
};

module.exports = {
  config: config
};
