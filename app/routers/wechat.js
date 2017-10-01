const router = require('koa-router')();
const wechatController = require('../middlewares').wx;

router.get('/user/voucher', wechatController.voucher);//获取用户代金券
router.post('/user/voucher/update', wechatController.updateVoucher);//更新用户代金券

router.post('/pay', wechatController.pay);
module.exports= router;