const db = require('../utils/mysql');

exports.setService = (data)=> {
	return db.add("USER_SERVICE", data);
}

//获取售后
exports.getService = ()=> {
	return db.find("SELECT * FROM USER_SERVICE ORDER BY CREATE_TIME DESC");	
}
