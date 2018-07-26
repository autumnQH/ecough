const db = require('../utils/mysql');

//更新config
exports.saveNotify = (data)=> {
	return db.add("NOTIFY", data)
}
