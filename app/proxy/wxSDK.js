const wechatDAO = require("../dao/wechat");

exports.getWeSDK = ()=> {
	return wechatDAO.getJsapiTicket();
}
exports.getWeAccessToken = ()=> {
	return wechatDAO.getActiveAccessToken();
}
