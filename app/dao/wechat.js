const db = require("../utils/mysql");

var getActiveAccessToken = async () => {    
	var result = await db.findOne("SELECT * FROM T_WECHAT_TOKEN ORDER BY CREATE_TIME DESC LIMIT 1");
	return result.access_token; 
}

module.exports = {    
	getActiveAccessToken : getActiveAccessToken 
};
