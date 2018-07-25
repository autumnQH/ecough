const order = require('../dao/order');

/**
 * 根据订单状态获取订单
 */
exports.getOrder = () => {
	return order.getOrder()
}

exports.getRefundList = () => {
	return order.getRefundList()
}

/**
 * 添加一条订单
 * @param {Object} data 订单数据
 */
exports.setOrder = (data)=> {
	return order.setOrder(data)
}

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

/**
 * 根据订单ID修改订单
 * @params { Int } id 订单ID
 * @params { Object } data 订单数据 
 */
exports.updateOrderById = (id, data) => {
	return order.updateOrderById(id, data)
}

/**
 * 根据订单号获取用户订单
 * @param { String } out_trade_no 订单号
 */
exports.getOrderByOutTradeNo = (out_trade_no)=> {
	return order.getOrderByOutTradeNo(out_trade_no)
}
