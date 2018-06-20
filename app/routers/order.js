const router = require('koa-router')();
const orderController = require('../middlewares').order;

router.get('/create', orderController.create); // 创建订单

module.exports= router;
