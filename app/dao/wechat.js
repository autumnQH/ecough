const db = require("../utils/mysql");

exports.getActiveAccessToken = async () => {    
	var result = await db.findOne("SELECT * FROM WECHAT ORDER BY id DESC LIMIT 1");
	return result.access_token; 
}

exports.fetchToken = () => {
	return db.findOne("SELECT * FROM TOKEN ORDER BY id DESC LIMIT 1")
}

exports.saveToken = async (data) => {
	const result = await db.findOne("SELECT * FROM TOKEN ORDER BY id DESC LIMIT 1")
	if(result.access_token) {
		data.update_time = (new Date().getTime())
		return db.update("TOKEN", data, {id: result.id})
	}else {
		data.create_time = data.update_time = (new Date().getTime())
		return db.add("TOKEN", data)
	}
}

exports.fetchTicket = () => {
	return db.findOne("SELECT * FROM TICKET ORDER BY id DESC LIMIT 1")
}

exports.saveTicket = async (data) => {
	const result = await db.findOne("SELECT * FROM TICKET ORDER BY id DESC LIMIT 1")
	if(result.ticket) {
		data.update_time = (new Date().getTime())
		return db.update("TICKET", data, {id: result.id})
	}else {
		data.create_time = data.update_time = (new Date().getTime())
		return db.add("TICKET", data)
	}
}


exports.getJsapiTicket = async () => {
	var result = await db.findOne("SELECT * FROM WECHAT ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.jsapi_ticket;
}

exports.getQRCode = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_QRCODE");
	return result;
}

exports.setQRCode = async (data) => {	
	var result = db.add("T_WECHAT_QRCODE", data);
	return result;
}

exports.getOneUser = async (openid) => {
	var result = await db.findOne("SELECT * FROM T_WECHAT_USER  WHERE openid='" + openid + "'");
	return result;
}


exports.getUser = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_USER");
	return result;
}

exports.setUser = async (data) => {
	var result = db.add("T_WECHAT_USER", data);
	return result;
}

exports.updateUser = async (data, value)=>{
	var result = db.update("T_WECHAT_USER", data, value);
	return result;
}

//获取订单
exports.getOrder = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME DESC");
	return result;
}

//设置微信小店
exports.setStoreOrder = async (data) => {
	var result = db.add("STORE_ORDER", data);
	return result;
}

//根据订单号获取
exports.getOutTradeNo = async (out_trade_no) => {
	var result = db.findOne("SELECT id,openid,pay_money,status,product,specifications FROM T_WECHAT_ORDER WHERE status = 2 AND out_trade_no=" +  out_trade_no );
	return result;
}

//设置发货
exports.adminSetDeliver = async (data, id) => {
	var result = db.update("T_WECHAT_ORDER", data, id)
	return result;
}

//获取config
exports.getConfig = async () => {
	var result = db.findOne("SELECT * FROM CONFIG WHERE id = 1");
	return result;
}

//设置config
exports.setConfig = async (data) => {
	var result = db.update("CONFIG", data, {id: 1});
	return result;
}

//设置支付通知
exports.setNOTIFY = async (data)=>{
	var result = db.add("NOTIFY", data);
	return result;
}

//删除订单
exports.delOrderByOutTradeNo = async (out_trade_no) => {
	var result = db.delete("T_WECHAT_ORDER", {out_trade_no: out_trade_no});
	return result;
}

//取消订单
exports.updateOrderStatus = (out_trade_no) => {
	var result = db.update("T_WECHAT_ORDER", {status: 0}, {out_trade_no: out_trade_no});
	return result
}

exports.setFAQ = (data) => {
	var result = db.add("FAQ",data);
	return result
}
exports.getFAQTitle = () => {
	var result = db.find("SELECT id,title FROM FAQ ORDER BY create_time DESC ");
	return result;
}
exports.getFAQById = (id) => {
	var result = db.findOne("SELECT * FROM FAQ WHERE id='" +id+ "'")
	return result;
}

exports.updateFAQById = (data, id) =>{
	var result = db.update("FAQ",data, {id: id});
	return result;
}
exports.delFAQ = (id) => {
	var result = db.delete("FAQ", {id: id});
	return result;
}

exports.refundVoucherByOutTradeNo = (order_id)=> {
	var result = db.update("USER_VOUCHER", {status: 2, order_id: null}, {order_id: order_id});
	return result
}
exports.refundUserByOutTradeNo = (out_trade_no) =>{
	var result = db.update("T_WECHAT_USER", {flag: '1'}, {flag: out_trade_no});
	return result;
}

exports.getGiftForConsumeByNameAndSpecifications = (name, specifications)=> {
	return db.findOne("SELECT consume FROM GIFT WHERE name = '"+ name+"' AND specifications = '"+ specifications+"'");
}

