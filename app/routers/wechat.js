const router = require('koa-router')();
const wechatController = require('../middlewares').wx;

router.get('/user/voucher/:openid', wechatController.voucher);//获取用户代金券

router.get('/pay', wechatController.pay);
module.exports= router;