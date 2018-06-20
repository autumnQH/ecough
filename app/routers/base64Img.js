const router = require('koa-router')();
const imgController = require('../middlewares').Img;

router.post('/', imgController.index); // base64转图片

module.exports= router;
