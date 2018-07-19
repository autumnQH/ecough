var db = require("../utils/mysql");

//添加订单
exports.setOrder = (order)=> {
	return db.add("T_WECHAT_ORDER", order);
}

//根据id查找订单
exports.getOneOrderById = (id)=> {
	return db.findOne("SELECT * FROM T_WECHAT_ORDER WHERE ?", {id: id});
}
//根据openid 查找用户订单号
exports.getOrderForTradeByOpenId = (openid)=> {
	return db.find("SELECT out_trade_no FROM T_WECHAT_ORDER WHERE openid = '"+ openid +"'");
}
//修改订单状态
exports.updateOrderStatusById = (id, status)=> {
	return db.update("T_WECHAT_ORDER", {status}, {id});
}
