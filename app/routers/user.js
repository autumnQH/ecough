const router = require('koa-router')();
const userController = require('../middlewares').user;

router.get('/', userController.home);

module.exports= router;