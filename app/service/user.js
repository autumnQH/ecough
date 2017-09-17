const userDao = require('../dao/user.js');

var getUserOrder = async (openid) => {
	var result = await userDao.getUserOrder(openid);
	return result;
}

var getUserOrderNumber = async(openid) => {
	var result = await userDao.getUserOrderNumber(openid);
	return result;
}

var setUserService = async (data) => {
	var result = await userDao.setUserService(data);
	return result;
}

var getUserService = async () => {
	var result = await userDao.getUserService();
	return result;
}
module.exports = { 
	getUserOrder: getUserOrder,
	getUserOrderNumber: getUserOrderNumber,
	setUserService: setUserService,
	getUserService: getUserService
};
