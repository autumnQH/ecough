const router = require('koa-router')();
const smsController = require('../middlewares').sms;

router.post('/send', smsController.send); // 阿里云短信服务API

module.exports= router;
