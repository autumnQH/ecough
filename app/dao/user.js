var db = require("../utils/mysql");

var getUserById = (userId) => {    
	var user = db.getById("t_user", userId); 
	return user; 
}

var setUserAddress = (data) => {
	var user = db.add("USER_ADDRESS", data);
	return user
}

var delUserAddress = (id) => {
	var result = db.delete("USER_ADDRESS", id);
	return result;
} 

var getUserAddress = (openid) => {
	var result  = db.find("SELECT * FROM USER_ADDRESS", openid);
	return result;
}

var getUserOrder = (openid) => {
	var result = db.find("SELECT * FROM T_WECHAT_ORDER ORDER BY CREATE_TIME", openid);
	return result;
}

module.exports = {    
	getUserById : getUserById,
	setUserAddress: setUserAddress,
	delUserAddress: delUserAddress,
	getUserAddress: getUserAddress,
	getUserOrder: getUserOrder
};
