const db = require("../utils/mysql");

var getActiveAccessToken = async () => {    
	var result = await db.findOne("SELECT * FROM wechat ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.access_token; 
}

var getJsapiTicket = async () => {
	var result = await db.findOne("SELECT * FROM wechat ORDER BY CREATE_TIME DESC LIMIT 1");
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

var getOneSpread = async (userName, ticket, eventKey) => {
	var result = await db.findOne("SELECT * FROM T_WECHAT_SPREAD  WHERE userName='" + userName + "' AND ticket='" + ticket + "' AND eventKey='" + eventKey+ "'");
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

var getOrder = async () => {
	var result = await db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME");
	return result;
}
var setOrder = async(data) => {
	var result = db.add("T_WECHAT_ORDER", data);
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
	getOrder: getOrder,
	setOrder: setOrder
};
