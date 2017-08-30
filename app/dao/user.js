var db = require("../utils/mysql");

var getUserById = (userId) => {    
	var user = db.getById("t_user", userId); 
	return user; 
}

var setUserAddress = (data) => {
	var result = db.add("USER_ADDRESS", data);
	return result;
}

var delUserAddress = (id) => {
	var result = db.delete("USER_ADDRESS", id);
	return result;
} 

var getUserAddress = (openid) => {
	var result  = db.find("SELECT * FROM USER_ADDRESS WHERE openid = '"+ openid +"'");
	return result;
}

var getUserOrder = (openid) => {
	var result = db.find("SELECT * FROM T_WECHAT_ORDER WHERE openid='" + openid + "' ORDER BY CREATE_TIME");
	return result;
}

var getUserOrderNumber = (openid) =>{
	var result = db.find("SELECT out_trade_no FROM T_WECHAT_ORDER WHERE openid='" + openid +"'");
	return result;
}

var setUserService = (data) => {
	var result = db.add("USER_SERVICE", data);
	return result;
}

var getUserService = () => {
	var result = db.find("SELECT * FROM USER_SERVICE");
	return result;
}
module.exports = {    
	getUserById : getUserById,
	setUserAddress: setUserAddress,
	delUserAddress: delUserAddress,
	getUserAddress: getUserAddress,
	getUserOrder: getUserOrder,
	getUserOrderNumber: getUserOrderNumber,
	setUserService: setUserService,
	getUserService: getUserService
};
