const db = require("../dao/wechat");

exports.getWXSDK = ()=> {
	return db.findOne("SELECT * FROM WECHAT ORDER BY CREATE_TIME DESC LIMIT 1");
}
