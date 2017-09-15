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

var customUpdateUser = (openid) => {
	return db.find("update T_WECHAT_USER set order_count = IFNULL(order_count, 0) +1 where openid = '"+ openid +"'");
}

var setUser = async (data) => {
	var result = db.add("T_WECHAT_USER", data);
	return result;
}

var updateUser = async (data, value)=>{
	var result = db.update("T_WECHAT_USER", data, value);
	return result;
}

var getOrder = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME DESC");
	return result;
}
var setOrder = async(data) => {
	var result = db.add("T_WECHAT_ORDER", data);
	return result;
}
var setStoreOrder = async (data) => {
	var result = db.add("STORE_ORDER", data);
	return result;
}

var getOutTradeNo = async (out_trade_no) => {
	var result = db.findOne("SELECT id FROM T_WECHAT_ORDER WHERE status = 2 AND out_trade_no=" +  out_trade_no );
	return result;
}

var adminSetDeliver = async (data, id) => {
	var result = db.update("T_WECHAT_ORDER", data, id)
	return result;
}



var getConfig = async () => {
	var result = db.findOne("SELECT * FROM CONFIG WHERE id = 1");
	return result;
}

var setConfig = async (data) => {
	var result = db.update("CONFIG", data, {id: 1});
	return result;
}

var setNOTIFY = async (data)=>{
	var result = db.add("NOTIFY", data);
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
	setNOTIFY: setNOTIFY
};
