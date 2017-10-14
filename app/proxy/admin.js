const admin = require('../dao/admin');

//获取订单
exports.getOrder = ()=> {
	return admin.getOrder();
}
/**
 * 根据订单号获取订单ID
 * @param {String} out_trade_no 订单号
 */
exports.getOrderIdByOutTradeNo = (out_trade_no)=> {
	return admin.getOrderIdByOutTradeNo(out_trade_no);
}
/**
 * 根据订单号获取用户订单
 * @param {String} out_trade_no 订单号
 */
exports.getOrderByOutTradeNo = (out_trade_no)=> {
	return admin.getOrderByOutTradeNo(out_trade_no);
}

/**
 * 更新订单物流
 * @param {Object} data 数据包
 */
exports.updateOrderExpress = (data)=> {
	return admin.updateOrderExpress(data);
}

//获取售后
exports.getService = ()=> {
	return admin.getService();
}

//获取常见问题
exports.getFAQ = ()=> {
	return admin.getFAQ();
}
/**
 * 获取一条常见问题
 * @param {String} id ID
 */
exports.getFAQById = (id)=> {
	return admin.getFAQById(id);
}
/**
 * 根据Id修改一条FAQ
 * @param {Object} data 数据包
 * @param {String} id ID
 */
exports.updateFAQ = (data, id)=> {
	return admin.updateFAQ(data, id);
}
/**
 * 删除一条FAQ
 * @param {String} id ID
 */
exports.delFAQ = (id)=> {
	return admin.delFAQ(id);
}
/**
 * 增加一条FAQ
 * @param {Object} data 数据包
 */
exports.addFAQ = (data)=> {
	return admin.addFAQ(data);
}
/**
 * 获取所有产品
 */
exports.getStore = ()=> {
	return admin.getStore();
}
/**
 * 更新产品
 * @param {Object} data 数据包
 */
exports.updateStore = (data)=> {
	return admin.updateStore(data);
}
//获取CONFIG
exports.getConfig = ()=> {
	return admin.getConfig();
}
/**
 * 更新CONFIG
 * @param {Object} data 数据包
 */
exports.updateConfig = (data)=> {
	return admin.updateConfig(data);
}
//获取所有礼品
exports.getGift = ()=> {
	return admin.getGift();
}

/**
 * 增加一条礼品
 * @param {Object} data 数据包
 */
exports.addGift = (data)=> {
	return admin.addGift(data);
}

/**
 * 根据Id获取一条礼品信息
 * @param {String} id ID 
 */
exports.getGiftById = (id)=> {
	return admin.getGiftById(id);
}

/**
 * 根据Id修改一条礼品信息
 * @param {Object} data 数据包
 * @param {String} id ID
 */
exports.updateGift = (data, id)=> {
	return admin.updateGift(data, id);
}

/**
 * 根据ID删除一条礼品
 * @param {String} id ID
 */
exports.delGiftById = (id)=> {
	return admin.delGiftById(id);
}