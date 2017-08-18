const userDao = require('../dao/user.js');

var getUserById = async (userId) => {    
	var user = await userDao.getUserById(userId);    
	return user; 
}

module.exports = {    
	getUserById : getUserById 
};
