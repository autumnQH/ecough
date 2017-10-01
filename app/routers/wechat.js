const router = require('koa-router')();
const wechatController = require('../middlewares').wx;

router.get('/user/voucher', wechatController.voucher);//获取用户代金券

router.post('/pay', wechatController.pay);
module.exports= router;