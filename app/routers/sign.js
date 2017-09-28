const router = require('koa-router')();
const signController = require('../middlewares').sign;

router.post('/', signController.SignIn);
router.all('/', signController.showSignIn);
module.exports= router;