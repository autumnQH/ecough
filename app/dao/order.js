var db = require("../utils/mysql");
//订单状态(2-待发货, 3-已发货, 5-已完成, 8-维权中 0-取消 4-申请退款 )

//获取状态非4的订单
exports.getOrder = () => {
	return db.find("SELECT * FROM T_WECHAT_ORDER WHERE status != 4 ORDER BY CREATE_TIME DESC")
}
//获取状态是4的订单
exports.getRefundList = ()=> {
	return db.find("SELECT * FROM T_WECHAT_ORDER WHERE status = 4 ORDER BY CREATE_TIME DESC")
}

//添加订单
exports.setOrder = (order)=> {
	return db.add("T_WECHAT_ORDER", order);
}
//根据id查找订单
exports.getOneOrderById = (id)=> {
	return db.findOne("SELECT * FROM T_WECHAT_ORDER WHERE ?", {id});
}
//根据openid 查找用户订单号
exports.getOrderForTradeByOpenId = (openid)=> {
	return db.find("SELECT out_trade_no FROM T_WECHAT_ORDER WHERE ?", {openid});
}
//修改订单
exports.updateOrderById = (id, data)=> {
	return db.update("T_WECHAT_ORDER", data, {id});
}

//根据订单号获取用户订单
exports.getOrderByOutTradeNo = (out_trade_no)=> {
	return db.findOne("SELECT * FROM T_WECHAT_ORDER WHERE ? ", {out_trade_no: out_trade_no});
}

