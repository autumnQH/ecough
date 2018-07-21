const router = require('koa-router')();
const wechatController = require('../middlewares').wx;

router.get('/', wechatController.checkToken) // 验证微信服务器发送来的消息
router.post('/', wechatController.postHandle)// 接收并回复微信服务器发来的消息
router.get('/signature', wechatController.signature);//获取网页签名
router.post('/pay', wechatController.pay);//微信支付

module.exports= router;
