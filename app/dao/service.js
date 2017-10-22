const db = require('../utils/mysql');

exports.setService = (data)=> {
	return db.add("USER_SERVICE", data);
}