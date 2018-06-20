const router = require('koa-router')();
const productController = require('../middlewares').product;

router.get('/:product', productController.getProductById); // 获取商品

module.exports= router;