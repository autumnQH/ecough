const db = require("../utils/mysql");

var getActiveAccessToken = async () => {    
	var result = await db.findOne("SELECT * FROM WECHAT ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.access_token; 
}

var getJsapiTicket = async () => {
	var result = await db.findOne("SELECT * FROM WECHAT ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.jsapi_ticket;
}

var getQRCode = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_QRCODE");
	return result;
}

var setQRCode = async (data) => {	
	var result = db.add("T_WECHAT_QRCODE", data);
	return result;
}

// var getOneSpread = async (openid, ticket, eventKey) => {
// 	var result = await db.findOne("SELECT * FROM T_WECHAT_SPREAD  WHERE openid='" + openid + "' AND ticket='" + ticket + "' AND eventKey='" + eventKey+ "'");
// 	return result;
// }

var getOneUser = async (openid) => {
	var result = await db.findOne("SELECT * FROM T_WECHAT_USER  WHERE openid='" + openid + "'");
	return result;
}


var getUser = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_USER");
	return result;
}

var customUpdateUser = (openid, out_trade_no) => {
	return db.find("update T_WECHAT_USER set order_count = IFNULL(order_count, 0) +1, flag = '"+ out_trade_no+"' where openid = '"+ openid +"'");
}

var setUser = async (data) => {
	var result = db.add("T_WECHAT_USER", data);
	return result;
}

var updateUser = async (data, value)=>{
	var result = db.update("T_WECHAT_USER", data, value);
	return result;
}

//获取订单
var getOrder = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME DESC");
	return result;
}

//添加订单
var setOrder = async(data) => {
	var result = db.add("T_WECHAT_ORDER", data);
	return result;
}

//设置微信小店
var setStoreOrder = async (data) => {
	var result = db.add("STORE_ORDER", data);
	return result;
}

//根据订单号获取
var getOutTradeNo = async (out_trade_no) => {
	var result = db.findOne("SELECT id,openid,pay_money FROM T_WECHAT_ORDER WHERE status = 2 AND out_trade_no=" +  out_trade_no );
	return result;
}

//设置发货
var adminSetDeliver = async (data, id) => {
	var result = db.update("T_WECHAT_ORDER", data, id)
	return result;
}

//获取config
var getConfig = async () => {
	var result = db.findOne("SELECT * FROM CONFIG WHERE id = 1");
	return result;
}

//设置config
var setConfig = async (data) => {
	var result = db.update("CONFIG", data, {id: 1});
	return result;
}

//设置支付通知
var setNOTIFY = async (data)=>{
	var result = db.add("NOTIFY", data);
	return result;
}

//删除订单
var delOrderByOutTradeNo = async (out_trade_no) => {
	var result = db.delete("T_WECHAT_ORDER", {out_trade_no: out_trade_no});
	return result;
}

//取消订单
var updateOrderStatus = (out_trade_no) => {
	var result = db.update("T_WECHAT_ORDER", {status: 0}, {out_trade_no: out_trade_no});
	return result
}

var setFAQ = (data) => {
	var result = db.add("FAQ",data);
	return result
}
var getFAQTitle = () => {
	var result = db.find("SELECT id,title FROM FAQ ORDER BY create_time DESC ");
	return result;
}
var getFAQById = (id) => {
	var result = db.findOne("SELECT * FROM FAQ WHERE id='" +id+ "'")
	return result;
}

var updateFAQById = (data, id) =>{
	var result = db.update("FAQ",data, {id: id});
	return result;
}
var delFAQ = (id) => {
	var result = db.delete("FAQ", {id: id});
	return result;
}

var refundVoucherByOutTradeNo = (order_id)=> {
	var result = db.update("USER_VOUCHER", {status: 2, order_id: null}, {order_id: order_id});
	return result
}
var refundUserByOutTradeNo = (out_trade_no) =>{
	var result = db.update("T_WECHAT_USER", {flag: '1'}, {flag: out_trade_no});
	return result;
}
module.exports = {    
	getActiveAccessToken : getActiveAccessToken,
	getJsapiTicket: getJsapiTicket,
	getQRCode: getQRCode,
	setQRCode: setQRCode,
	getOneUser: getOneUser,
	customUpdateUser: customUpdateUser,
	getUser: getUser,
	setUser: setUser,
	updateUser: updateUser,
	getOrder: getOrder,
	setOrder: setOrder,
	setStoreOrder: setStoreOrder,
	getOutTradeNo:getOutTradeNo,
	adminSetDeliver: adminSetDeliver,
	getConfig: getConfig,
	setConfig: setConfig,
	setNOTIFY: setNOTIFY,
	delOrderByOutTradeNo: delOrderByOutTradeNo,
	updateOrderStatus: updateOrderStatus,
	setFAQ: setFAQ,
	getFAQTitle: getFAQTitle,
	getFAQById: getFAQById,
	updateFAQById: updateFAQById,
	delFAQ: delFAQ,
	refundVoucherByOutTradeNo: refundVoucherByOutTradeNo,
	refundUserByOutTradeNo: refundUserByOutTradeNo
};
