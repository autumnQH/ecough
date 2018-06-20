const router = require('koa-router')();
const notifyController = require('../middlewares').notify;

router.post('/', notifyController.index);

module.exports= router;
