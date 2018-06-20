const router = require('koa-router')();
const notifyController = require('../middlewares').notify;

router.post('/', notifyController.index); // 微信支付收款通知

module.exports= router;
