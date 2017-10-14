const router = require('koa-router')();
const checkAdmin = require('../middlewares/').check.checkAdmin;
const adminController = require('../middlewares').admin;

router.get('/', checkAdmin, adminController.home);
router.get('/order',checkAdmin, adminController.showOrder);//显示所有订单
router.post('/order', adminController.order);//添加一条订单
router.post('/order/express',checkAdmin, adminController.express);//更新订单物流
router.get('/service', checkAdmin, adminController.showService);//显示售后服务
router.get('/FAQ', checkAdmin ,adminController.showFAQ);//显示常见问题
router.get('/FAQ/create', checkAdmin, adminController.showAddFAQ);//显示添加FAQ
router.put('/FAQ/create', checkAdmin, adminController.addFAQ);//添加FAQ
router.get('/FAQ/:id', checkAdmin, adminController.showEditFAQ);//显示一条常见问题
router.post('/FAQ/:id', checkAdmin, adminController.updateFAQ);//修改FAQ
router.del('/FAQ/:id', checkAdmin, adminController.delFAQ);//删除FAQ
router.get('/store', checkAdmin, adminController.showStore);//显示所有产品
router.post('/store', checkAdmin, adminController.updateStore);//修改产品
router.get('/config', checkAdmin, adminController.showConfig);//显示config
router.post('/config', checkAdmin, adminController.updateConfig);//修改config
router.get('/gift', adminController.showGift);//显示礼品列表
router.get('/gift/create', adminController.showAddGift);//显示添加礼品
router.put('/gift/create', adminController.addGift);//显示添加礼品
router.get('/gift/:id', adminController.showEditGift);//显示一条礼品
router.post('/gift/:id', adminController.updateGift);//显示一条礼品
router.del('/gift/:id', adminController.delGiftById);//显示一条礼品
module.exports= router;