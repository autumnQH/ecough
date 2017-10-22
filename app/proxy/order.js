const order = require('../dao/order');

/**
 * 根据订单id查找一条订单
 * @param {Int} id 订单ID
 */
exports.getOneOrderById = (id)=> {
	return order.getOneOrderById(id);
}

/**
 * 根据openid获取用户订单号
 * @param {String} openid 用户标示
 */
exports.getOrderForTradeByOpenId = (openid)=> {
	return order.getOrderForTradeByOpenId(openid);
}
