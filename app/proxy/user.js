const user = require('../dao/user');
/**
 * 获取用户信息
 * @param {String} openid 用户标示
 */
exports.getUserByOpenId = (openid)=> {
	return user.getUserInfoByOpenId(openid);
}

/**
 * 删除用户信息
 * @param {String} openid 用户标示
 */
exports.removeUserByOpenId = (openid)=> {
	return user.removeUserByOpenId(openid);
}
/**
 * 删除推广员
 * @param {String} openid 用户标示
 */
exports.removeUserForEventKeyByOpenid = (openid)=> {
	return user.removeUserForEventKeyByOpenid(openid);
}
/**
 * 增加用户积分
 * @param {Int} integral 积分
 * @param {Int} order_count 下单次数
 * @param {String} openid 用户标示
 */
// exports.addUserIntegralByOpenId = (integral, order_count, openid)=> {
// 	return user.addUserForIntegralByOpendId({integral: integral, order_count: order_count}, {openid: openid});
// }

/**
 * 增加用户代金券
 * @param {Object} data 数据包
 */
// exports.addUserVoucherByOpenId = (data)=> {
// 	return user.setUserVoucher(data);
// }
/**
 * 获取用户代金券
 * @param {String} openid 用户标示
 */
exports.getUserVoucherByOpenId = (openid)=> {
	return user.getUserVoucherByOpenId(openid);
}
/**
 * 设置用户代金券状态
 * @param {Int} id ID
 * @param {String} order_id 订单ID
 */
exports.updateUserVoucherById = (id, order_id)=> {
	return user.updateUserVoucherById(id, order_id);
}

//显示礼物列表
exports.showGift = ()=> {
	return user.showGift();
}

/**
 * 显示一条礼物信息
 * @param {String} openid 用户标示
 * @param {Int} id ID
 */
exports.showGiftById = (openid, id)=> {
	return user.showGiftById(openid, id);
}

/**
 * 增加推广员件数
 * @param {String} eventKey 推广员openid
 * @param {Int} total 增加数量
 */
exports.addUserConsumeByEventKey = (eventKey, total)=> {
	return user.addUserConsumeByEventKey(eventKey, total);
}

/**
 * 扣除用户件数
 * @param {String} openid 用户标示
 * @param {Int} consume 扣除数量
 */
exports.delUserConsumeByOpenId = (openid, consume)=> {
	return user.delUserConsumeByOpenId(openid, consume);
}

/**
 * 下单次数+1
 * @param {String} openid 用户标示
 */
exports.addUserOrderCountByOpenId = (openid)=> {
	return user.addUserOrderCountByOpenId(openid);
}