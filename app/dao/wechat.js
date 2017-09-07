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

var getOneSpread = async (openid) => {
	var result = await db.findOne("SELECT * FROM T_WECHAT_SPREAD  WHERE openid='" + openid + "'");
	return result;
}


var getSpread = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_SPREAD");
	return result;
}
var setSpread = async (data) => {
	var result = db.add("T_WECHAT_SPREAD", data);
	return result;
}

var updateSpread = async (data, value)=>{
	var result = db.update("T_WECHAT_SPREAD", data, value);
	return result;
}

var getOrder = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME");
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

var getOpenIdForSubscribe = async (openid) => {
	var result = db.findOne("SELECT * FROM T_WECHAT_SUBSCRIBE WHERE openid='" + openid+ "'");
	return result;
}

var setOpenIdForSubscribe = async (data, value) => {
	var result = db.update("T_WECHAT_SUBSCRIBE", data, value);
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
	getOneSpread: getOneSpread,
	getSpread: getSpread,
	setSpread: setSpread,
	updateSpread: updateSpread,
	getOrder: getOrder,
	setOrder: setOrder,
	setStoreOrder: setStoreOrder,
	getOutTradeNo:getOutTradeNo,
	adminSetDeliver: adminSetDeliver,
	getOpenIdForSubscribe: getOpenIdForSubscribe,
	setOpenIdForSubscribe: setOpenIdForSubscribe,
	getConfig: getConfig,
	setConfig: setConfig,
	setNOTIFY: setNOTIFY
};
