const db = require('../utils/mysql');

//获取订单
exports.getOrder = ()=> {
	return db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME DESC");
}
//根据订单号获取用户订单
exports.getOrderByOutTradeNo = (out_trade_no)=> {
	return db.findOne("SELECT * FROM T_WECHAT_ORDER WHERE ? ", {out_trade_no: out_trade_no});
}
//根据订单号获取订单ID
exports.getOrderIdByOutTradeNo = (out_trade_no)=> {
	return db.findOne("SELECT id FROM T_WECHAT_ORDER WHERE ? ", {out_trade_no: out_trade_no});
}
//设置订单物流
exports.updateOrderExpress = (data)=> {
	return db.update("T_WECHAT_ORDER",data, {out_trade_no: data.out_trade_no});
}
//获取售后
exports.getService = ()=> {
	return db.find("SELECT * FROM USER_SERVICE ORDER BY CREATE_TIME DESC");	
}
//获取常见问题
exports.getFAQ = ()=> {
	return db.find("SELECT * FROM FAQ ORDER BY CREATE_TIME DESC");
}
//获取一条常见问题
exports.getFAQById = (id)=> {
	return db.findOne("SELECT * FROM FAQ WHERE ? ",{id: id});
}
//获取一条FAQ
exports.updateFAQ = (data, id)=> {
	return db.update("FAQ",data, {id: id});
}
//根据ID删除一条FAQ
exports.delFAQ = (id)=> {
	return db.delete("FAQ", {id: id});
}
//增加一天FAQ
exports.addFAQ = (data)=> {
	return db.add("FAQ", data);
}
//获取产品
exports.getStore = ()=> {
	return db.find("SELECT * FROM STORE");
}
//更新产品
exports.updateStore = (data)=> {
	return db.update("STORE", data, {product_id: data.product_id});
}
//获取config
exports.getConfig = ()=> {
	return db.findOne("SELECT * FROM CONFIG");
}

exports.saveConfig = (data) => {
	return db.add("CONFIG", data)
}
//更新config
exports.updateConfig = (data)=> {
	return db.update("CONFIG", data, {id: 1});
}
//获取礼品列表
exports.getGift = ()=> {
	return db.find("SELECT * FROM GIFT ORDER BY CREATE_TIME DESC");
}
//添加礼品
exports.addGift = (data)=> {
	return db.add("GIFT", data);
}
//获取一条礼品信息
exports.getGiftById = (id)=> {
	return db.findOne("SELECT * FROM GIFT WHERE ? ",{id: id});
}
//根据Id修改礼品信息
exports.updateGift = (data, id)=> {
	return db.update("GIFT", data, {id: id});
}
//根据ID删除一条礼品
exports.delGiftById = (id)=> {
	return db.delete("GIFT", {id: id})
}
