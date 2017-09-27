const user = require('../dao/user');
/**
 * 获取用户信息
 * @param {String} openid 用户标示
 */
exports.getUserByOpenId = (openid)=> {
	return user.getUserInfoByOpenId(openid);
}
/**
 * 增加用户积分
 * @param {Int} integral 积分
 * @param {Int} order_count 下单次数
 * @param {String} openid 用户标示
 */
exports.addUserIntegralByOpenId = (integral, order_count, openid)=> {
	return user.addUserForIntegralByOpendId({integral: integral, order_count: order_count}, {openid: openid});
}

/**
 * 增加用户代金券
 * @param {Object} data 数据包
 */
exports.addUserVoucherByOpenId = (data)=> {
	return user.setUserVoucher(data);
}