const db = require('../utils/mysql');

//获取config
exports.getConfig = () => {
	return db.findOne("SELECT * FROM CONFIG WHERE id = 1");
}

//更新config
exports.saveConfig = (data)=> {
	return db.update("CONFIG", data, {id: 1});
}
