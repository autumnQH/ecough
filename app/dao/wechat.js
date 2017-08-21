const db = require("../utils/mysql");
const request = require('request');
const config = require('../config/config');

var getActiveAccessToken = async () => {    
	var result = await db.findOne("SELECT * FROM T_WECHAT_TOKEN ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.access_token; 
}

var getJsapiTicket = async () => {
	var result = await db.findOne("SELECT * FROM T_WECHAT_TICKET ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.jsapi_ticket;
}

module.exports = {    
	getActiveAccessToken : getActiveAccessToken,
	getJsapiTicket: getJsapiTicket 
};
