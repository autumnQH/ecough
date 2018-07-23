var db = require("../utils/mysql");

//获取状态非4的订单
exports.getOrder = () => {
	return db.find("SELECT * FROM T_WECHAT_ORDER WHERE status != 4 ORDER BY CREATE_TIME DESC")
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
//修改订单状态
exports.updateOrderStatusById = (id, status)=> {
	return db.update("T_WECHAT_ORDER", {status}, {id});
}
