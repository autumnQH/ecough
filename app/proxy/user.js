const user = require('../dao/user');
const order = require('../dao/order');
const service = require('../dao/service');
const FAQ = require('../dao/FAQ');
const isArray = arr => Array.isArray(arr)? arr : [arr]

/**
 * 查询用户是否第一次购买
 * @param {String} openid 用户标示
 * @return {flag} flag 1表示没有购买，否则是对应的订单号
 */
exports.getUserFlagByOpenId = (openid)=> {
	return user.getUserFlagByOpenId
}

/**
 * 新增用户
 * @param {Object} data 数据
 */
exports.updateUser = (data) => {
	data.create_time = (new Date().getTime())
	data.tagid_list = data.tagid_list.join()
	return user.saveUser(data)
}

/**
 * 获取用户信息
 * @param {String} openid 用户标示
 */
exports.getUserByOpenId = (openid)=> {
	return user.getUserInfoByOpenId(openid);
}

/**
 * 修改用户第一次购买状态 
 * @param {String} openid 用户标示
 * @param {String} out_trade_no (1 是第一次购买， 否则是订单号)
 */
exports.updateUserByFlag = (openid, out_trade_no)=> {
	return user.updateUserByFlag(openid, out_trade_no)
}

// new end

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
 * 修改用户手机号码
 * @parsm {Object} data 数据包
 */
exports.setUserForPhone = (data)=> {
	return user.setUserPhone(data);
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
// exports.getUserVoucherByOpenId = (openid)=> {
// 	return user.getUserVoucherByOpenId(openid);
// }
/**
 * 设置用户代金券状态
 * @param {Int} id ID
 * @param {String} order_id 订单ID
 */
// exports.updateUserVoucherById = (id, order_id)=> {
// 	return user.updateUserVoucherById(id, order_id);
// }

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

/**
 * 根据openid和状态码获取用户订单
 * @param {String} openid 用户标示
 * @param {Int} status 状态码 (2-待发货, 3-已发货, 5-已完成, 8-维权中 0-取消)
 * @param {Int} page 
 * @param {Int} size 
 */
exports.getUserOrderForStatusByStatusAndOpenId = (openid, status,page,size)=> {
	return user.getUserOrderForStatusByStatusAndOpenId(openid, status, page, size);
} 

/**
 * 获取我推广的人
 * @param {String} eventKey 推广人openid 
 */
exports.getUserByEnentKey = (eventKey)=> {
	return user.getUserByEnentKey(eventKey);
}

/**
 * 获取我的推广人数，件数
 * @parsm {String} eventKey 推广人openid
 */
exports.getUserTotalConsume = (eventKey)=> {
	return user.getUserTotalConsume(eventKey);
}

/**
 * 添加一条售后服务
 * @param {Object} data 数据包
 */
exports.setService = (data)=> {
	return service.setService(data);
}

//获取常见问题
exports.getFAQ = ()=> {
	return FAQ.getFAQ();
}

/**
 * 根据id获取一条常见问题
 * @param {Int} id ID
 */
exports.getFAQById = (id)=> {
	return FAQ.getFAQById(id);
}
