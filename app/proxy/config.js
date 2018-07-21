const config = require('../dao/config');

exports.getConfig = ()=> {
	return config.getConfig()
}
