const router = require('koa-router')();
const wechatController = require('../middlewares').wx;

router.get('/sdk', wechatController.sdk);//获取网页js-sdk
router.post('/pay', wechatController.pay);//微信支付

module.exports= router;