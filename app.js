﻿const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const path = require('path')

const bodyParser = require('koa-bodyparser');
const xmlParser = require('koa-xml-body').default;
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const compress = require('koa-compress')

//const json = require('koa-json');

const controller = require('./controller');
const logUtil = require('./utils/log');

//session
const session = require('koa-session2');
const Store = require('./Store.js');

app.use(session({
  store: new Store()
}));

//模板
app.use(views(path.join(__dirname, './app/views'), {
  extension: 'ejs'
}))

//日志
app.use(logger());

//解析xml数据
app.use(xmlParser());

//解析表单和json请求数据
app.use(bodyParser()); 

app.use(require('koa-static')(__dirname + '/app/public'));

//http 压缩
// app.use(compress({
//     filter: function (content_type) {
//         return /text/i.test(content_type)
//     },
//     threshold: 2048,
//     flush: require('zlib').Z_SYNC_FLUSH
// }))

//logger
// app.use(async (ctx, next) => {
//   //响应开始时间
//   const start = new Date();
//   //响应间隔时间
//   var ms;
//   try {
//     //开始进入到下一个中间件
//     await next();

//     ms = new Date() - start;
//     //记录响应日志
//     logUtil.logResponse(ctx, ms);

//   } catch (error) {    
//     ms = new Date() - start;
//     //记录异常日志
//     logUtil.logError(ctx, error, ms);
//   }
// });

//控制器
app.use(controller(path.join(__dirname, './app/controllers')));

app.on('error', function(err, ctx){
    console.log(err)
    logUtil.logError(ctx, err);
});

//创建微信菜单
const wechatService = require('./app/service/wechat');
wechatService.createMenu(path.join(__dirname, "./app/config/wechat_menu.json"));

app.listen(8080);
