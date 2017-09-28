const config = require('../dao/config');

/**
 *获取config
 * return 
 * {Int} derate_money 首单减免金额
 * {String} spread_voucher 推广获得m面值代金券
 * {String} signup_phone_integral 注册手机获得x积分
 * {String} shoping_integral 购买商品获得x积分
 * {String} n_integral n积分换取m面值代金券
 * {String} m_voucher m面值代金券
 */
exports.getActivityCFG = ()=> {
	return config.getActivityCFG();
}