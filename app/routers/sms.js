const router = require('koa-router')();
const smsController = require('../middlewares').sms;

router.post('/send', smsController.send);

module.exports= router;
