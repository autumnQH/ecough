const router = require('koa-router')();
const imgController = require('../middlewares').Img;

router.post('/', imgController.index);

module.exports= router;