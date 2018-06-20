const router = require('koa-router')();
const admin = require('./admin');
const sign = require('./sign');
const base64 = require('./base64Img');
const wx = require('./wechat');
const user = require('./user');
const sms = require('./sms')

router.use('/admin',admin.routes(), admin.allowedMethods());
router.use('/sign',sign.routes(), sign.allowedMethods());
router.use('/base64', base64.routes(), base64.allowedMethods());
router.use('/wx', wx.routes(), wx.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/sms', sms.routes(), sms.allowedMethods());

module.exports = router;
