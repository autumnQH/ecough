const router = require('koa-router')();
const checkUser = require('../middlewares/').check.checkUser;
const userController = require('../middlewares').user;

router.get('/order', checkUser, userController.showOrder);
router.get('/gift', userController.showGift);
router.get('/gift/:id', checkUser, userController.showGiftById);
router.get('/order/status',checkUser, userController.getOrderByStatus);

module.exports= router;