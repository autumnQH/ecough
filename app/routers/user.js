const router = require('koa-router')();
const checkUser = require('../middlewares/').check.checkUser;
const userController = require('../middlewares').user;

router.get('/', checkUser, userController.index);//个人中心
router.get('/gift', userController.showGift);//礼物列表
router.get('/gift/:id', checkUser, userController.showGiftById);//某个礼物信息
router.get('/order', checkUser, userController.showOrder);//礼物订单
router.get('/my/order', userController.showUserOrder);//显示订单页面
router.get('/order/status', userController.getOrderByStatus);//根据订单状态查找订单
router.get('/order/info', userController.getOrderInfoById);//根据订单状态查找订单


module.exports= router;