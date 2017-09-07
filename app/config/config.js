var config = async function () {
  const dao = require('../dao/wechat');
  var cfg =  await dao.getConfig();
// var config = {
//     wx: {
//       appid: 'wxff24c10734aed1ef',appSecret: 'e4f2067a90f7aed463e6bc51ba02f51d',
//       token: 'ecough',
//       mchid: '1470073502',
//       key: 'qwertyuiopasdfghjklzxcvbnm123456'
//       ,encodingAESKey: '9dq7tO5Gi7iP6tIiCUBUXM55eVG8CGCWuRS2zyk5CPS'
//       ,message: {
//         text: "终于等到您，还好没放弃！",
//         default: "冥冥之中自有缘分！" 
//       }
//     },
//     db: {
//       host: 'localhost',
//       name: 'ecough',
//       user: 'root',
//       passwd: 'root', 
//       conn_limit: 5
//     },
//     sms: {
//       accessKeyId: 'LTAI8ttec2BYuOMC',
//       secretAccessKey: '3sDGHGwyQWpNwCdSYoomAWFGj9wSUj',
//       TemplateCode: 'SMS_91000028',
//       SignName: '刘鹏'
//     },
//     server: {
//       host: 'http://www.e-cough.com',
//        port: 80
//     },
//     app: {
//       name: "ecough",
//       version: "1.0",
//     },
//     store: {
//       original_money: 10,
//       derate_money: 1
//     }
// };
var config = {
    wx: {
      appid: cfg.appid,
      appSecret: cfg.appSecret,
      token: cfg.token,
      mchid: cfg.store_mchid,
      key: cfg.store_key
      ,encodingAESKey: cfg.encodingAESKey
      ,message: {
        text: cfg.message_text,
        default: cfg.message_default 
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
      accessKeyId: cfg.sms_accessKeyId,
      secretAccessKey: cfg.sms_secretAccessKey,
      TemplateCode: cfg.sms_TemplateCode,
      SignName: cfg.sms_SignName
    },
    server: {
      host: cfg.server_host,
       port: cfg.server_port
    },
    app: {
      name: "ecough",
      version: "1.0",
    },
    store: {
      original_money: cfg.original_money,
      current_money: cfg.current_money,
      derate_money: cfg.derate_money
    }
};
console.log(config);
  return config;
};

module.exports = {
  config: config
};
