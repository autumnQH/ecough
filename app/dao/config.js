const db = require('../utils/mysql');

//获取config
exports.getConfig = () => {
	return db.findOne("SELECT * FROM CONFIG WHERE id = 1");
}

//更新config
exports.saveConfig = async (data)=> {
	const result = await this.getConfig()
	if(result.id) {
		return db.update("CONFIG", data, {id: 1});
	}else {
		return db.add("CONFIG", data)
	}
}
