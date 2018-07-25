const service = require('../dao/service')

//获取售后
exports.getService = () => {
	return service.getService()
}
