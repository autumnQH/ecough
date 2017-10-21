const router = require('koa-router')();
const wechatController = require('../middlewares').wx;

//router.get('/user/voucher', wechatController.voucher);//获取用户代金券

router.get('/sdk', wechatController.sdk);//获取网页js-sdk
router.post('/pay', wechatController.pay);//微信支付
router.get('/openAddress', wechatController.openAddress);//微信共享地址

module.exports= router;