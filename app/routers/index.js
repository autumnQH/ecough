const router = require('koa-router')();
const admin = require('./admin');
const sign = require('./sign');

router.use('/admin',admin.routes(), admin.allowedMethods());
router.use('/sign',sign.routes(), sign.allowedMethods());
module.exports = router;
