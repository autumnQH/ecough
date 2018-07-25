const config = require('../dao/config');

exports.getConfig = ()=> {
	return config.getConfig()
}

/**
 * 更新CONFIG
 * @param {Object} data 数据包
 */
exports.saveConfig = (data)=> {
	return config.saveConfig(data);
}
