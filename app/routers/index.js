const router = require('koa-router')();
const admin = require('./admin');
const sign = require('./sign');
const base64 = require('./base64Img');

router.use('/admin',admin.routes(), admin.allowedMethods());
router.use('/sign',sign.routes(), sign.allowedMethods());
router.use('/base64', base64.routes(), base64.allowedMethods());
module.exports = router;
