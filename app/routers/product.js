const router = require('koa-router')();
const productController = require('../middlewares').product;
const checkUser = require('../middlewares/').check.checkUser;

router.get('/:product', checkUser, productController.getProductById); // 获取商品

module.exports= router;
