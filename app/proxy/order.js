const order = require('../dao/order');

/**
 * 根据订单状态获取订单
 */
exports.getOrder = () => {
	return order.getOrder()
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
 * 根据订单ID修改订单状态
 * @params { Int } id 订单ID
 * @params { Number } status 订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 0-取消 4-申请退款 )
 */
exports.updateOrderStatusById = (id, status) => {
	return order.updateOrderStatusById(id, status)
}
