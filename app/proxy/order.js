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

/**
 * 根据订单号修改订单状态
 * @params { String } out_trade_no 订单号
 * @params { Number } status 订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 0-取消 4-申请退款 )
 */
exports.updateOrderStatusByOutTradeNo = (out_trade_no, status) => {
	return order.updateOrderStatusByOutTradeNo(out_trade_no, status)
}
