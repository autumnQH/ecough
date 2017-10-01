const wechat = require("../dao/wechat");

exports.getWXSDK = ()=> {
	return wechat.getJsapiTicket();
}
