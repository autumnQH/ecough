const router = require('koa-router')();
const orderController = require('../middlewares').order;
const checkUser = require('../middlewares/').check.checkUser;

router.get('/create', checkUser, orderController.create); // 创建订单

module.exports= router;
