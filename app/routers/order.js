const router = require('koa-router')();
const orderController = require('../middlewares').order;

router.get('/create', orderController.create);

module.exports= router;
