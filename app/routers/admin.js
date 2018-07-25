const router = require('koa-router')();
const checkAdmin = require('../middlewares/').check.checkAdmin;
const adminController = require('../middlewares').admin;

router.get('/', checkAdmin, adminController.home);
router.get('/order',checkAdmin, adminController.showOrder);//显示所有订单
router.post('/order', adminController.order);//添加一条订单
router.post('/order/express',checkAdmin, adminController.express);//更新订单物流
router.get('/refundList',checkAdmin, adminController.refundList);//申请退款列表
router.post('/refund',checkAdmin, adminController.refund);//申请退款列表
router.get('/service', checkAdmin, adminController.showService);//显示售后服务
router.get('/store', checkAdmin, adminController.showStore);//显示所有产品
router.post('/store', checkAdmin, adminController.updateStore);//修改产品
router.get('/config', checkAdmin, adminController.showConfig);//显示config
router.post('/config', checkAdmin, adminController.updateConfig);//修改config
router.get('/gift', checkAdmin, adminController.showGift);//显示礼品列表
router.get('/gift/create', checkAdmin, adminController.showAddGift);//显示添加礼品
router.put('/gift/create', checkAdmin, adminController.addGift);//显示添加礼品
router.get('/gift/:id', checkAdmin, adminController.showEditGift);//显示一条礼品
router.post('/gift/:id', checkAdmin, adminController.updateGift);//显示一条礼品
router.del('/gift/:id', checkAdmin, adminController.delGiftById);//显示一条礼品
router.get('/FAQ', checkAdmin, adminController.showFAQ);//显示常见问题
router.get('/FAQ/create', checkAdmin, adminController.showAddFAQ);//显示新建常见问题
router.post('/FAQ/create', checkAdmin, adminController.addFAQ);//新建常见问题
router.get('/FAQ/:id', checkAdmin, adminController.showEditFAQ);//显示一条常见问题
router.put('/FAQ/:id', checkAdmin, adminController.updateFAQ);//更新一条常见问题
router.del('/FAQ/:id', checkAdmin, adminController.delFAQ);//删除一条常见问题
module.exports= router;
