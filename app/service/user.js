const userDao = require('../dao/user.js');

var getUserById = async (userId) => {    
	var user = await userDao.getUserById(userId);    
	return user; 
}

var setUserAddress = async (data) => {
	var user = await userDao.setUserAddress(data);
	return user;
}

var delUserAddress = async (id) => {
	var result = await userDao.delUserAddress(id);
	return result;
}

var getUserAddress = async (openid) => {
	var result = await userDao.getUserAddress(openid);
	return result;
}

var getUserOrder = async (openid) => {
	var result = await userDao.getUserOrder(openid);
	return result;
}

module.exports = {    
	getUserById : getUserById,
	setUserAddress: setUserAddress,
	delUserAddress: delUserAddress,
	getUserAddress: getUserAddress,
	getUserOrder: getUserOrder
};
