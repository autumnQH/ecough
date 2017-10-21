const wechat = require("../dao/wechat");

exports.getWeSDK = ()=> {
	return wechat.getJsapiTicket();
}
exports.getWeAccessToken = ()=> {
	return wechat.getActiveAccessToken();
}
