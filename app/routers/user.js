const router = require('koa-router')();
const checkUser = require('../middlewares/').check.checkUser;
const userController = require('../middlewares').user;

router.get('/gift', userController.showGift);
router.get('/gift/:id', userController.showGiftById);

module.exports= router;